import json, sys, time, urllib.parse, urllib.request

def search(q, n=25):
    url = "https://api.github.com/search/repositories?q=%s&sort=stars&order=desc&per_page=%d" % (urllib.parse.quote(q), n)
    req = urllib.request.Request(url, headers={"User-Agent":"research-script","Accept":"application/vnd.github+json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            sys.stderr.write("ERR %s: %s\n" % (q, e)); time.sleep(12)
    return None

if __name__ == "__main__":
    outfile = sys.argv[1]
    queries = sys.argv[2:]
    all_repos = {}
    for i, q in enumerate(queries):
        d = search(q)
        if d and "items" in d:
            for it in d["items"]:
                key = it["full_name"]
                if key not in all_repos:
                    all_repos[key] = {
                        "full_name": key,
                        "stars": it["stargazers_count"],
                        "pushed_at": it["pushed_at"][:10],
                        "lang": it.get("language"),
                        "license": (it.get("license") or {}).get("spdx_id"),
                        "archived": it.get("archived"),
                        "desc": (it.get("description") or "")[:180],
                        "found_by": q,
                    }
            sys.stderr.write("OK  %-40s total_count=%s items=%s\n" % (q, d.get("total_count"), len(d["items"])))
        else:
            sys.stderr.write("FAIL %s\n" % q)
        time.sleep(7)
    with open(outfile, "w") as f:
        json.dump(list(all_repos.values()), f, ensure_ascii=False, indent=1)
    print("saved", len(all_repos), "repos ->", outfile)
