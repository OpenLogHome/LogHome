"""Run against the local SSR preview: python3 tests/reading-seo-ssr.py http://localhost:60709
Read-only HTTP checks. No browser JavaScript, authenticated requests, or database writes.
"""
import json
import sys
from html.parser import HTMLParser
from urllib.request import urlopen, Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.parse import quote

class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.images = []; self.image_attrs = []; self.inputs = []; self.links = []; self.meta = {}; self.canonical = []; self.title = ''; self.schema = []; self.script = False; self.json_script = False; self.script_text = ''; self.in_title = False; self.text = ''; self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a': self.links.append(attrs.get('href', ''))
        if tag == 'img': self.images.append(attrs.get('src', '')); self.image_attrs.append(attrs)
        if tag == 'input': self.inputs.append(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical.append(attrs.get('href'))
        if tag == 'meta': self.meta[attrs.get('name') or attrs.get('property')] = attrs.get('content')
        if tag == 'title': self.in_title = True
        if tag == 'script': self.script = True; self.json_script = attrs.get('type') == 'application/ld+json'; self.script_text = ''
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script':
            if self.json_script: self.schema.append(json.loads(self.script_text))
            self.script = False; self.json_script = False
    def handle_data(self, data):
        if self.script: self.script_text += data
        else:
            self.text += data
            if self.in_title: self.title += data

origin = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:60709'
def read(path, ua='LogHome SSR regression'):
    with urlopen(Request(origin + path, headers={'User-Agent': ua}), timeout=25) as response:
        assert response.status == 200, path
        assert response.geturl() == origin + path, 'Public reading must not redirect to a SPA'
        return Document(response.read().decode())

paths = [('/read', '/read', '阅读书库'), ('/read?page=2', '/read?page=2', '第 2 页'), ('/read/rank?board=logpower&zone=all', '/read/rank?board=logpower', '原木力榜'), ('/read/rank?board=logpower&page=2', '/read/rank?board=logpower&page=2', '第 2 页'), ('/read/collections?title=' + quote('入站必读'), '/read/collections?title=' + quote('入站必读'), '入站必读'), ('/tag/collections?tag_id=3', '/tag/collections?tag_id=3', '我的世界')]
for path, canonical, title in paths:
    doc = read(path)
    assert title in doc.title, (path, doc.title)
    assert doc.canonical == ['https://loghome.ink' + canonical], (path, doc.canonical)
    assert doc.meta.get('description') and doc.meta.get('og:url') == doc.canonical[0]
    assert any(link.startswith(('/novel/', '/manga/', '/world/')) for link in doc.links), 'SSR work links missing: ' + path
    assert doc.schema and doc.schema[0]['@type'] == 'ItemList'
    print('PASS public SSR content, canonical and schema:', path)
assert any('page=2' in link for link in read('/read').links), 'Crawler-accessible next-page link missing'
first, second = read('/read'), read('/read?page=2')
assert second.schema[0]['itemListElement'][0]['position'] == 25
first_ids = {item['url'] for item in first.schema[0]['itemListElement']}; second_ids = {item['url'] for item in second.schema[0]['itemListElement']}
assert not first_ids.intersection(second_ids), 'Page 2 must have its own server-loaded works'
print('PASS real pagination and crawl links without JavaScript')
for path, prefix in [('/novel/43', '/article/'), ('/manga/686', '/manga/read/'), ('/world/524', '/article/')]:
    doc = read(path)
    assert any(link.startswith(prefix) for link in doc.links), 'Public catalog must use links'
    assert len(doc.canonical) == 1
    print('PASS SSR detail and public chapter/word links:', path)
comic_path = next(link for link in read('/manga/686').links if link.startswith('/manga/read/'))
comic = read(comic_path)
assert comic.images and any(link.startswith('/manga/read/') for link in comic.links)
assert comic.canonical == ['https://loghome.ink' + comic_path.split('?')[0]]
print('PASS comic reader SSR images, episode navigation and canonical')
for query, page in [('edge=end', 9), ('pageIdx=2', 3)]:
    for ua in ['LogHome SSR regression', 'Mozilla/5.0 (iPhone) Mobile Safari/604.1']:
        doc = read('/manga/read/9354?novelId=686&' + query, ua)
        assert any(image.get('src') and image.get('alt', '').endswith('第 ' + str(page) + ' 页') for image in doc.image_attrs)
        assert any(field.get('type') == 'range' and field.get('aria-label') == '漫画页码' and field.get('value') == str(page) for field in doc.inputs)
        assert doc.canonical == ['https://loghome.ink/manga/read/9354']
for path in ['/manga/read/9354?novelId=43', '/manga/read/invalid', '/manga/read/999999999']:
    try: read(path)
    except HTTPError as error: assert error.code == 404, (path, error.code)
    else: raise AssertionError('Mismatched or missing comic must return HTTP 404: ' + path)
print('PASS comic explicit/last-page SSR image and accessible page value, mobile parity, canonical and real HTTP 404')
article = read('/article/156?paragraphId=2&mode=text')
assert '方之古元历' in article.text and article.canonical == ['https://loghome.ink/article/156']
assert read('/read/bookcase').meta['robots'] == 'noindex,follow'
for ua in ['Mozilla/5.0 (Linux; Android 6.0.1) Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'Mozilla/5.0 (iPhone) Mobile Safari/604.1']:
    assert '阅读，打开另一个世界' in read('/read', ua).text
print('PASS public body, account-page noindex and consistent smartphone SSR')
for work_id, message in [(43, '尚未完结'), (613, '已完结，感谢陪伴')]:
    path = '/read/end/' + str(work_id)
    doc = read(path)
    assert message in doc.text and '猜你喜欢' in doc.text, 'End page must load public work and recommendations on the server'
    assert doc.canonical == ['https://loghome.ink' + path]
    assert doc.meta['robots'] == 'noindex,follow'
    assert any(link.startswith('/article/') and 'edge=end' in link for link in doc.links)
    assert any(link.startswith(('/novel/', '/manga/', '/world/')) and link != '/novel/' + str(work_id) for link in doc.links)
    assert path + '#book-reviews' in doc.links, 'Review anchor must not resolve against the global base URL'
    assert message in read(path, 'Mozilla/5.0 (iPhone) Mobile Safari/604.1').text
print('PASS completed/ongoing end-page SSR, typed recommendations, last-chapter/review anchors and consistent mobile response')
for ua in ['LogHome SSR regression', 'Mozilla/5.0 (iPhone) Mobile Safari/604.1']:
    doc = read('/read/ask/43', ua)
    assert '向原木娘提问' in doc.text and '方圆之外的故事' in doc.text
    assert '/novel/43' in doc.links and '/me/settings' in doc.links
    assert doc.canonical == ['https://loghome.ink/read/ask/43']
    assert doc.meta['robots'] == 'noindex,follow'
    assert '待接收' not in doc.text and '思考与检索过程' not in doc.text
print('PASS assistant SSR public context, no private conversation, noindex/canonical and consistent smartphone response')
malicious = '</script><svg onload=alert(1)>'
doc = read('/read/collections?title=' + quote(malicious))
assert doc.schema[0]['name'] == malicious
print('PASS JSON-LD safely preserves special characters')
for path in ['/novel/999999999', '/article/999999999', '/read/end/999999999', '/read/end/invalid', '/read/ask/999999999', '/read/ask/invalid', '/read/comment/999999999', '/read/comment/invalid', '/read/comment/19749?novelId=686', '/read?page=100', '/read/rank?page=100', '/tag/collections?tag_id=3&page=100']:
    try: read(path)
    except HTTPError as error: assert error.code == 404, (path, error.code)
    else: raise AssertionError('Missing content must return 404: ' + path)
print('PASS missing public works and chapters return HTTP 404')

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None
for ua in ['LogHome SSR regression', 'Mozilla/5.0 (iPhone) Mobile Safari/604.1']:
    try:
        build_opener(NoRedirect).open(Request(origin + '/read/comment/19749?novelId=43', headers={'User-Agent': ua}), timeout=25)
    except HTTPError as result:
        assert result.code == 302, result.code
        target = result.headers.get('Location', '')
        assert target.startswith('/article/') and 'preLoadCommentId=19749' in target, target
        assert read(target).canonical == ['https://loghome.ink' + target.split('?')[0]]
    else: raise AssertionError('Comment notification must redirect to its native public context')
print('PASS comment notification resolves by HTTP redirect on desktop/mobile, public target canonical excludes private anchor')

# Full world vocabulary and relationship data must be present before client hydration.
for path in ['/world/524', '/world/relations/524']:
    doc = read(path)
    assert '符咒' in doc.text and '精神力' in doc.text and '言灵师' in doc.text
    assert '/article/7340' in doc.links and '/article/8653' in doc.links
    assert doc.canonical == ['https://loghome.ink' + path]
    assert doc.schema
    if 'relations' in path:
        assert '替代' in doc.text and '通往' in doc.text and '包含' in doc.text
        assert doc.schema[0]['@type'] == 'ItemList' and len(doc.schema[0]['itemListElement']) == 12
    mobile = read(path, 'Mozilla/5.0 (iPhone) Mobile Safari/604.1')
    assert mobile.canonical == doc.canonical and '精神力' in mobile.text
print('PASS complete world vocabulary/relationship SSR text, crawlable links, canonical/JSON-LD and smartphone response')
class NoWorldRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None
for path, target in [('/world/22', '/world/524'), ('/world/relations/22?comment_id=11', '/world/relations/524?preLoadCommentId=11')]:
    try:
        build_opener(NoWorldRedirect).open(origin + path, timeout=25)
        assert False, 'Expected canonical redirect'
    except HTTPError as failure:
        assert failure.code == 301 and failure.headers['Location'] == target
try:
    urlopen(origin + '/world/relations/9999999999', timeout=25)
    assert False, 'Expected missing-world 404'
except HTTPError as failure: assert failure.code == 404
print('PASS world legacy-ID 301 preserves comment target and missing relationship work is HTTP 404')

for work_id, detail_path in [(43, '/novel/43'), (686, '/manga/686'), (524, '/world/524')]:
    path = '/read/power/' + str(work_id)
    doc = read(path + '?name=untrusted-query-name&score=0')
    assert '原木力说明' in doc.title and '基础分计算' in doc.text and '更新频率修正' in doc.text
    assert '打赏及其他' in doc.text and '1 + (相差天数 + 5) × 0.066' in doc.text
    assert '按当前数据计算' in doc.text and '当前榜单分值' in doc.text
    assert 'untrusted-query-name' not in doc.title + doc.text
    assert detail_path in doc.links and '/read/rank?board=logpower' in doc.links
    assert doc.canonical == ['https://loghome.ink' + path]
    mobile = read(path, 'Mozilla/5.0 (iPhone) Mobile Safari/604.1')
    assert mobile.canonical == doc.canonical and '基础分计算' in mobile.text
for path in ['/read/power/invalid', '/read/power/999999999']:
    try: read(path)
    except HTTPError as failure: assert failure.code == 404
    else: raise AssertionError('Missing explanation must return HTTP 404')
print('PASS all public work-type power explanations are server-loaded, ignore untrusted scores, canonical/mobile-safe and missing works are HTTP 404')
assert all('/read/power/' + str(work_id) in read(path).links for work_id,path in [(43,'/novel/43'),(686,'/manga/686'),(524,'/world/524')])
print('PASS public work details expose crawler-accessible power explanation links')
