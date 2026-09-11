# Httpx_Docs - Other

**Pages:** 1

---

## Text Encodings

**URL:** https://www.python-httpx.org/advanced/text-encodings/

**Contents:**
- Text Encodings
- Using the default encoding
- Using an explicit encoding
- Using auto-detection

When accessing response.text, we need to decode the response bytes into a unicode text representation.

By default httpx will use "charset" information included in the response Content-Type header to determine how the response bytes should be decoded into text.

In cases where no charset information is included on the response, the default behaviour is to assume "utf-8" encoding, which is by far the most widely used text encoding on the internet.

To understand this better let's start by looking at the default behaviour for text decoding...

This is normally absolutely fine. Most servers will respond with a properly formatted Content-Type header, including a charset encoding. And in most cases where no charset encoding is included, UTF-8 is very likely to be used, since it is so widely adopted.

In some cases we might be making requests to a site where no character set information is being set explicitly by the server, but we know what the encoding is. In this case it's best to set the default encoding explicitly on the client.

In cases where the server is not reliably including character set information, and where we don't know what encoding is being used, we can enable auto-detection to make a best-guess attempt when decoding from bytes to text.

To use auto-detection you need to set the default_encoding argument to a callable instead of a string. This callable should be a function which takes the input bytes as an argument and returns the character set to use for decoding those bytes to text.

There are two widely used Python packages which both handle this functionality:

Let's take a look at installing autodetection using one of these packages...

Once chardet is installed, we can configure a client to use character-set autodetection.

**Examples:**

Example 1 (lua):
```lua
import httpx
# Instantiate a client with the default configuration.
client = httpx.Client()
# Using the client...
response = client.get(...)
print(response.encoding)  # This will either print the charset given in
                          # the Content-Type charset, or else "utf-8".
print(response.text)  # The text will either be decoded with the Content-Type
                      # charset, or using "utf-8".
```

Example 2 (lua):
```lua
import httpx
# Instantiate a client with a Japanese character set as the default encoding.
client = httpx.Client(default_encoding="shift-jis")
# Using the client...
response = client.get(...)
print(response.encoding)  # This will either print the charset given in
                          # the Content-Type charset, or else "shift-jis".
print(response.text)  # The text will either be decoded with the Content-Type
                      # charset, or using "shift-jis".
```

Example 3 (unknown):
```unknown
$ pip install httpx
$ pip install chardet
```

Example 4 (python):
```python
import httpx
import chardet

def autodetect(content):
    return chardet.detect(content).get("encoding")

# Using a client with character-set autodetection enabled.
client = httpx.Client(default_encoding=autodetect)
response = client.get(...)
print(response.encoding)  # This will either print the charset given in
                          # the Content-Type charset, or else the auto-detected
                          # character set.
print(response.text)
```

---
