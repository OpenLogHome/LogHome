
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
        // Check if this is a real closing quote
        let isClosing = false;
        let j = i + 1;
        while (j < jsonStr.length && /\s/.test(jsonStr[j])) j++;
        
        if (j >= jsonStr.length) {
          isClosing = true; // End of input
        } else {
          const nextChar = jsonStr[j];
          if (nextChar === '}' || nextChar === ']') {
            isClosing = true;
          } else if (nextChar === ',' || nextChar === ':') {
            // Check what comes after the separator
            // If the next token is a valid JSON start (string, object, array, boolean, number, null),
            // then this quote is likely a closing quote.
            // Otherwise, it's likely an unescaped inner quote.
            let k = j + 1;
            while (k < jsonStr.length && /\s/.test(jsonStr[k])) k++;
            
            if (k >= jsonStr.length) {
                isClosing = true; // Trailing separator, assume closing
            } else {
                const afterNext = jsonStr[k];
                // Valid start chars for a value or key: " { [ t f n digit -
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
          // It's an unescaped quote inside a string
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
    // If it's already an object/array, return it.
    // If it's null/undefined/number/boolean, return it.
    // However, usually this function expects a string.
    return jsonStr; 
  }

  // 1. Try parsing the string directly (Best case)
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Try repairing the JSON string
    try {
        return JSON.parse(jsonRepair(jsonStr));
    } catch (e2) {
        // Continue to other methods
    }
  }

  // 2. Try extracting from Markdown code blocks (Common in LLM output)
  // Matches ```json ... ``` or ``` ... ```
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
          // Continue
      }
    }
  }

  // 3. Heuristic: Find the widest possible JSON object or array
  // This helps when there is text before/after the JSON.
  
  const firstOpenBrace = jsonStr.indexOf('{');
  const firstOpenBracket = jsonStr.indexOf('[');
  
  let startIdx = -1;
  let endIdx = -1;
  
  // Determine if we should look for an Object or Array based on which comes first
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
          // Try repairing the extracted JSON
          try {
            return JSON.parse(jsonRepair(extracted));
          } catch (e2) {
            // We return null as a last resort.
          }
      }
  }

  return null;
}

export default parseJson;
