# Httpx_Docs - Getting Started

**Pages:** 2

---

## HTTPX

**URL:** https://www.python-httpx.org/

**Contents:**
- HTTPX
- Features
- Documentation
- Dependencies
- Installation

HTTPX is a fully featured HTTP client for Python 3, which provides sync and async APIs, and support for both HTTP/1.1 and HTTP/2.

Install HTTPX using pip:

Now, let's get started:

Or, using the command-line client.

Which now allows us to use HTTPX directly from the command-line...

HTTPX builds on the well-established usability of requests, and gives you:

Plus all the standard features of requests...

For a run-through of all the basics, head over to the QuickStart.

For more advanced topics, see the Advanced section, the async support section, or the HTTP/2 section.

The Developer Interface provides a comprehensive API reference.

To find out about tools that integrate with HTTPX, see Third Party Packages.

The HTTPX project relies on these excellent libraries:

As well as these optional installs:

A huge amount of credit is due to requests for the API layout that much of this work follows, as well as to urllib3 for plenty of design inspiration around the lower-level networking details.

Or, to include the optional HTTP/2 support, use:

To include the optional brotli and zstandard decoders support, use:

HTTPX requires Python 3.9+

**Examples:**

Example 1 (unknown):
```unknown
$ pip install httpx
```

Example 2 (html):
```html
>>> import httpx
>>> r = httpx.get('https://www.example.org/')
>>> r
<Response [200 OK]>
>>> r.status_code
200
>>> r.headers['content-type']
'text/html; charset=UTF-8'
>>> r.text
'<!doctype html>\n<html>\n<head>\n<title>Example Domain</title>...'
```

Example 3 (markdown):
```markdown
# The command line client is an optional dependency.
$ pip install 'httpx[cli]'
```

Example 4 (unknown):
```unknown
$ pip install httpx
```

---

## QuickStart

**URL:** https://www.python-httpx.org/quickstart/

**Contents:**
- QuickStart
- Passing Parameters in URLs
- Response Content
- Binary Response Content
- JSON Response Content
- Custom Headers
- Sending Form Encoded Data
- Sending Multipart File Uploads
- Sending JSON Encoded Data
- Sending Binary Request Data

First, start by importing HTTPX:

Now, let’s try to get a webpage.

Similarly, to make an HTTP POST request:

The PUT, DELETE, HEAD, and OPTIONS requests all follow the same style:

To include URL query parameters in the request, use the params keyword:

To see how the values get encoding into the URL string, we can inspect the resulting URL that was used to make the request:

You can also pass a list of items as a value:

HTTPX will automatically handle decoding the response content into Unicode text.

You can inspect what encoding will be used to decode the response.

In some cases the response may not contain an explicit encoding, in which case HTTPX will attempt to automatically determine an encoding to use.

If you need to override the standard behaviour and explicitly set the encoding to use, then you can do that too.

The response content can also be accessed as bytes, for non-text responses:

Any gzip and deflate HTTP response encodings will automatically be decoded for you. If brotlipy is installed, then the brotli response encoding will be supported. If zstandard is installed, then zstd response encodings will also be supported.

For example, to create an image from binary data returned by a request, you can use the following code:

Often Web API responses will be encoded as JSON.

To include additional headers in the outgoing request, use the headers keyword argument:

Some types of HTTP requests, such as POST and PUT requests, can include data in the request body. One common way of including that is as form-encoded data, which is used for HTML forms.

Form encoded data can also include multiple values from a given key.

You can also upload files, using HTTP multipart encoding:

You can also explicitly set the filename and content type, by using a tuple of items for the file value:

If you need to include non-file data fields in the multipart form, use the data=... parameter:

Form encoded data is okay if all you need is a simple key-value data structure. For more complicated data structures you'll often want to use JSON encoding instead.

For other encodings, you should use the content=... parameter, passing either a bytes type or a generator that yields bytes.

You may also want to set a custom Content-Type header when uploading binary data.

We can inspect the HTTP status code of the response:

HTTPX also includes an easy shortcut for accessing status codes by their text phrase.

We can raise an exception for any responses which are not a 2xx success code:

Any successful response codes will return the Response instance rather than raising an exception.

The method returns the response instance, allowing you to use it inline. For example:

The response headers are available as a dictionary-like interface.

The Headers data type is case-insensitive, so you can use any capitalization.

Multiple values for a single response header are represented as a single comma-separated value, as per RFC 7230:

A recipient MAY combine multiple header fields with the same field name into one “field-name: field-value” pair, without changing the semantics of the message, by appending each subsequent field-value to the combined field value in order, separated by a comma.

For large downloads you may want to use streaming responses that do not load the entire response body into memory at once.

You can stream the binary content of the response...

Or the text of the response...

Or stream the text, on a line-by-line basis...

HTTPX will use universal line endings, normalising all cases to \n.

In some cases you might want to access the raw bytes on the response without applying any HTTP content decoding. In this case any content encoding that the web server has applied such as gzip, deflate, brotli, or zstd will not be automatically decoded.

If you're using streaming responses in any of these ways then the response.content and response.text attributes will not be available, and will raise errors if accessed. However you can also use the response streaming functionality to conditionally load the response body:

Any cookies that are set on the response can be easily accessed:

To include cookies in an outgoing request, use the cookies parameter:

Cookies are returned in a Cookies instance, which is a dict-like data structure with additional API for accessing cookies by their domain or path.

By default, HTTPX will not follow redirects for all HTTP methods, although this can be explicitly enabled.

For example, GitHub redirects all HTTP requests to HTTPS.

You can modify the default redirection handling with the follow_redirects parameter:

The history property of the response can be used to inspect any followed redirects. It contains a list of any redirect responses that were followed, in the order in which they were made.

HTTPX defaults to including reasonable timeouts for all network operations, meaning that if a connection is not properly established then it should always raise an error rather than hanging indefinitely.

The default timeout for network inactivity is five seconds. You can modify the value to be more or less strict:

You can also disable the timeout behavior completely...

For advanced timeout management, see Timeout fine-tuning.

HTTPX supports Basic and Digest HTTP authentication.

To provide Basic authentication credentials, pass a 2-tuple of plaintext str or bytes objects as the auth argument to the request functions:

To provide credentials for Digest authentication you'll need to instantiate a DigestAuth object with the plaintext username and password as arguments. This object can be then passed as the auth argument to the request methods as above:

HTTPX will raise exceptions if an error occurs.

The most important exception classes in HTTPX are RequestError and HTTPStatusError.

The RequestError class is a superclass that encompasses any exception that occurs while issuing an HTTP request. These exceptions include a .request attribute.

The HTTPStatusError class is raised by response.raise_for_status() on responses which are not a 2xx success code. These exceptions include both a .request and a .response attribute.

There is also a base class HTTPError that includes both of these categories, and can be used to catch either failed requests, or 4xx and 5xx responses.

You can either use this base class to catch both categories...

Or handle each case explicitly...

For a full list of available exceptions, see Exceptions (API Reference).

**Examples:**

Example 1 (python):
```python
>>> import httpx
```

Example 2 (jsx):
```jsx
>>> r = httpx.get('https://httpbin.org/get')
>>> r
<Response [200 OK]>
```

Example 3 (unknown):
```unknown
>>> r = httpx.post('https://httpbin.org/post', data={'key': 'value'})
```

Example 4 (unknown):
```unknown
>>> r = httpx.put('https://httpbin.org/put', data={'key': 'value'})
>>> r = httpx.delete('https://httpbin.org/delete')
>>> r = httpx.head('https://httpbin.org/get')
>>> r = httpx.options('https://httpbin.org/get')
```

---
