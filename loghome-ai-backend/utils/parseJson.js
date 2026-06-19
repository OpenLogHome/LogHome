/**
 * JSON parsing utility with repair capability for LLM output.
 */

function jsonRepair(jsonStr) {
  let inString = false;
  let inEscape = false;
  let result = '';

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (inString) {
      if (inEscape) {
        result += char;
        inEscape = false;
      } else if (char === '\\') {
        result += char;
        inEscape = true;
      } else if (char === '"') {
        let isClosing = false;
        let j = i + 1;
        while (j < jsonStr.length && /\s/.test(jsonStr[j])) j++;

        if (j >= jsonStr.length) {
          isClosing = true;
        } else {
          const nextChar = jsonStr[j];
          if (nextChar === '}' || nextChar === ']') {
            isClosing = true;
          } else if (nextChar === ',' || nextChar === ':') {
            let k = j + 1;
            while (k < jsonStr.length && /\s/.test(jsonStr[k])) k++;

            if (k >= jsonStr.length) {
                isClosing = true;
            } else {
                const afterNext = jsonStr[k];
                if (/^["{\[tfn0-9-]/.test(afterNext)) {
                    isClosing = true;
                }
            }
          }
        }

        if (isClosing) {
          result += char;
          inString = false;
        } else {
          result += '\\"';
        }
      } else {
        result += char;
      }
    } else {
      result += char;
      if (char === '"') {
        inString = true;
      }
    }
  }
  return result;
}

function parseJson(jsonStr) {
  if (typeof jsonStr !== 'string') {
    return jsonStr;
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    try {
        return JSON.parse(jsonRepair(jsonStr));
    } catch (e2) {
    }
  }

  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = jsonStr.match(codeBlockRegex);
  if (match) {
    const content = match[1];
    try {
      return JSON.parse(content);
    } catch (e) {
      try {
        return JSON.parse(jsonRepair(content));
      } catch (e2) {
      }
    }
  }

  const firstOpenBrace = jsonStr.indexOf('{');
  const firstOpenBracket = jsonStr.indexOf('[');

  let startIdx = -1;
  let endIdx = -1;

  if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
      startIdx = firstOpenBrace;
      endIdx = jsonStr.lastIndexOf('}');
  } else if (firstOpenBracket !== -1) {
      startIdx = firstOpenBracket;
      endIdx = jsonStr.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const extracted = jsonStr.substring(startIdx, endIdx + 1);
      try {
          return JSON.parse(extracted);
      } catch (e) {
          try {
            return JSON.parse(jsonRepair(extracted));
          } catch (e2) {
          }
      }
  }

  return null;
}

module.exports = parseJson;