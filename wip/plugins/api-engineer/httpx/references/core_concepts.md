# Httpx_Docs - Core Concepts

**Pages:** 14

---

## Event Hooks

**URL:** https://www.python-httpx.org/advanced/event-hooks/

**Contents:**
- Event Hooks

HTTPX allows you to register "event hooks" with the client, that are called every time a particular type of event takes place.

There are currently two event hooks:

These allow you to install client-wide functionality such as logging, monitoring or tracing.

You can also use these hooks to install response processing code, such as this example, which creates a client instance that always raises httpx.HTTPStatusError on 4xx and 5xx responses.

Response event hooks are called before determining if the response body should be read or not.

If you need access to the response body inside an event hook, you'll need to call response.read(), or for AsyncClients, response.aread().

The hooks are also allowed to modify request and response objects.

Event hooks must always be set as a list of callables, and you may register multiple event hooks for each type of event.

As well as being able to set event hooks on instantiating the client, there is also an .event_hooks property, that allows you to inspect and modify the installed hooks.

If you are using HTTPX's async support, then you need to be aware that hooks registered with httpx.AsyncClient MUST be async functions, rather than plain functions.

**Examples:**

Example 1 (swift):
```swift
def log_request(request):
    print(f"Request event hook: {request.method} {request.url} - Waiting for response")

def log_response(response):
    request = response.request
    print(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")

client = httpx.Client(event_hooks={'request': [log_request], 'response': [log_response]})
```

Example 2 (python):
```python
def raise_on_4xx_5xx(response):
    response.raise_for_status()

client = httpx.Client(event_hooks={'response': [raise_on_4xx_5xx]})
```

Example 3 (sass):
```sass
def add_timestamp(request):
    request.headers['x-request-timestamp'] = datetime.now(tz=datetime.utc).isoformat()

client = httpx.Client(event_hooks={'request': [add_timestamp]})
```

Example 4 (unknown):
```unknown
client = httpx.Client()
client.event_hooks['request'] = [log_request]
client.event_hooks['response'] = [log_response, raise_on_4xx_5xx]
```

---

## Requests Compatibility Guide

**URL:** https://www.python-httpx.org/compatibility/

**Contents:**
- Requests Compatibility Guide
- Redirects
- Client instances
- Request URLs
- Determining the next redirect request
- Request Content
- Upload files
- Content encoding
- Cookies
- Status Codes

HTTPX aims to be broadly compatible with the requests API, although there are a few design differences in places.

This documentation outlines places where the API differs...

Unlike requests, HTTPX does not follow redirects by default.

We differ in behaviour here because auto-redirects can easily mask unnecessary network calls being made.

You can still enable behaviour to automatically follow redirects, but you need to do so explicitly...

Or else instantiate a client, with redirect following enabled by default...

The HTTPX equivalent of requests.Session is httpx.Client.

is generally equivalent to

Accessing response.url will return a URL instance, rather than a string.

Use str(response.url) if you need a string instance.

The requests library exposes an attribute response.next, which can be used to obtain the next redirect request.

In HTTPX, this attribute is instead named response.next_request. For example:

For uploading raw text or binary content we prefer to use a content parameter, in order to better separate this usage from the case of uploading form data.

For example, using content=... to upload raw content:

And using data=... to send form data:

Using the data=<text/byte content> will raise a deprecation warning, and is expected to be fully removed with the HTTPX 1.0 release.

HTTPX strictly enforces that upload files must be opened in binary mode, in order to avoid character encoding issues that can result from attempting to upload files opened in text mode.

HTTPX uses utf-8 for encoding str request bodies. For example, when using content=<str> the request body will be encoded to utf-8 before being sent over the wire. This differs from Requests which uses latin1. If you need an explicit encoding, pass encoded bytes explicitly, e.g. content=<str>.encode("latin1"). For response bodies, assuming the server didn't send an explicit encoding then HTTPX will do its best to figure out an appropriate encoding. HTTPX makes a guess at the encoding to use for decoding the response using charset_normalizer. Fallback to that or any content with less than 32 octets will be decoded using utf-8 with the error="replace" decoder strategy.

If using a client instance, then cookies should always be set on the client rather than on a per-request basis.

This usage is supported:

This usage is not supported:

We prefer enforcing a stricter API here because it provides clearer expectations around cookie persistence, particularly when redirects occur.

In our documentation we prefer the uppercased versions, such as codes.NOT_FOUND, but also provide lower-cased versions for API compatibility with requests.

Requests includes various synonyms for status codes that HTTPX does not support.

HTTPX provides a .stream() interface rather than using stream=True. This ensures that streaming responses are always properly closed outside of the stream block, and makes it visually clearer at which points streaming I/O APIs may be used with a response.

Within a stream() block request data is made available with:

HTTPX defaults to including reasonable timeouts for all network operations, while Requests has no timeouts by default.

To get the same behavior as Requests, set the timeout parameter to None:

HTTPX uses the mounts argument for HTTP proxying and transport routing. It can do much more than proxies and allows you to configure more than just the proxy route. For more detailed documentation, see Mounting Transports.

When using httpx.Client(mounts={...}) to map to a selection of different transports, we use full URL schemes, such as mounts={"http://": ..., "https://": ...}.

This is different to the requests usage of proxies={"http": ..., "https": ...}.

This change is for better consistency with more complex mappings, that might also include domain names, such as mounts={"all://": ..., httpx.HTTPTransport(proxy="all://www.example.com": None}) which maps all requests onto a proxy, except for requests to "www.example.com" which have an explicit exclusion.

Also note that requests.Session.request(...) allows a proxies=... parameter, whereas httpx.Client.request(...) does not allow mounts=....

When using a Client instance, the ssl configurations should always be passed on client instantiation, rather than passed to the request method.

If you need more than one different SSL configuration, you should use different client instances for each SSL configuration.

The HTTP GET, DELETE, HEAD, and OPTIONS methods are specified as not supporting a request body. To stay in line with this, the .get, .delete, .head and .options functions do not support content, files, data, or json arguments.

If you really do need to send request data using these http methods you should use the generic .request function instead.

We don't support response.is_ok since the naming is ambiguous there, and might incorrectly imply an equivalence to response.status_code == codes.OK. Instead we provide the response.is_success property, which can be used to check for a 2xx response.

There is no notion of prepared requests in HTTPX. If you need to customize request instantiation, see Request instances.

Besides, httpx.Request() does not support the auth, timeout, follow_redirects, mounts, verify and cert parameters. However these are available in httpx.request, httpx.get, httpx.post etc., as well as on Client instances.

If you need to mock HTTPX the same way that test utilities like responses and requests-mock does for requests, see RESPX.

If you use cachecontrol or requests-cache to add HTTP Caching support to the requests library, you can use Hishel for HTTPX.

requests defers most of its HTTP networking code to the excellent urllib3 library.

On the other hand, HTTPX uses HTTPCore as its core HTTP networking layer, which is a different project than urllib3.

requests omits params whose values are None (e.g. requests.get(..., params={"foo": None})). This is not supported by HTTPX.

For both query params (params=) and form data (data=), requests supports sending a list of tuples (e.g. requests.get(..., params=[('key1', 'value1'), ('key1', 'value2')])). This is not supported by HTTPX. Instead, use a dictionary with lists as values. E.g.: httpx.get(..., params={'key1': ['value1', 'value2']}) or with form data: httpx.post(..., data={'key1': ['value1', 'value2']}).

requests allows event hooks to mutate Request and Response objects. See examples given in the documentation for requests.

In HTTPX, event hooks may access properties of requests and responses, but event hook callbacks cannot mutate the original request/response.

If you are looking for more control, consider checking out Custom Transports.

requests exception hierarchy is slightly different to the httpx exception hierarchy. requests exposes a top level RequestException, where as httpx exposes a top level HTTPError. see the exceptions exposes in requests here. See the httpx error hierarchy here.

**Examples:**

Example 1 (sass):
```sass
response = client.get(url, follow_redirects=True)
```

Example 2 (sass):
```sass
client = httpx.Client(follow_redirects=True)
```

Example 3 (unknown):
```unknown
session = requests.Session(**kwargs)
```

Example 4 (unknown):
```unknown
client = httpx.Client(**kwargs)
```

---

## Extensions

**URL:** https://www.python-httpx.org/advanced/extensions/

**Contents:**
- Extensions
- Request Extensions
  - "trace"
  - "sni_hostname"
  - "timeout"
  - "target"
- Response Extensions
  - "http_version"
  - "reason_phrase"
  - "stream_id"

Request and response extensions provide a untyped space where additional information may be added.

Extensions should be used for features that may not be available on all transports, and that do not fit neatly into the simplified request/response model that the underlying httpcore package uses as its API.

Several extensions are supported on the request:

The trace extension allows a callback handler to be installed to monitor the internal flow of events within the underlying httpcore transport.

The simplest way to explain this is with an example:

The event_name and info arguments here will be one of the following:

Note that when using async code the handler function passed to "trace" must be an async def ... function.

The following event types are currently exposed...

Establishing the connection

The exact set of trace events may be subject to change across different versions of httpcore. If you need to rely on a particular set of events it is recommended that you pin installation of the package to a fixed version.

The server's hostname, which is used to confirm the hostname supplied by the SSL certificate.

If you want to connect to an explicit IP address rather than using the standard DNS hostname lookup, then you'll need to use this request extension.

A dictionary of str: Optional[float] timeout values.

May include values for 'connect', 'read', 'write', or 'pool'.

This extension is how the httpx timeouts are implemented, ensuring that the timeout values are associated with the request instance and passed throughout the stack. You shouldn't typically be working with this extension directly, but use the higher level timeout API instead.

The target that is used as the HTTP target instead of the URL path.

This enables support constructing requests that would otherwise be unsupported.

Using the 'target' extension to send requests without the standard path escaping rules...

The target extension also allows server-wide OPTIONS * requests to be constructed...

The HTTP version, as bytes. Eg. b"HTTP/1.1".

When using HTTP/1.1 the response line includes an explicit version, and the value of this key could feasibly be one of b"HTTP/0.9", b"HTTP/1.0", or b"HTTP/1.1".

When using HTTP/2 there is no further response versioning included in the protocol, and the value of this key will always be b"HTTP/2".

The reason-phrase of the HTTP response, as bytes. For example b"OK". Some servers may include a custom reason phrase, although this is not recommended.

HTTP/2 onwards does not include a reason phrase on the wire.

When no key is included, a default based on the status code may be used.

When HTTP/2 is being used the "stream_id" response extension can be accessed to determine the ID of the data stream that the response was sent on.

The "network_stream" extension allows developers to handle HTTP CONNECT and Upgrade requests, by providing an API that steps outside the standard request/response model, and can directly read or write to the network.

The interface provided by the network stream:

This API can be used as the foundation for working with HTTP proxies, WebSocket upgrades, and other advanced use-cases.

See the network backends documentation for more information on working directly with network streams.

Extra network information

The network stream abstraction also allows access to various low-level information that may be exposed by the underlying socket:

The socket SSL information is also available through this interface, although you need to ensure that the underlying connection is still open, in order to access it...

**Examples:**

Example 1 (json):
```json
# Request timeouts actually implemented as an extension on
# the request, ensuring that they are passed throughout the
# entire call stack.
client = httpx.Client()
response = client.get(
    "https://www.example.com",
    extensions={"timeout": {"connect": 5.0}}
)
response.request.extensions["timeout"]
{"connect": 5.0}
```

Example 2 (markdown):
```markdown
client = httpx.Client()
response = client.get("https://www.example.com")
print(response.extensions["http_version"])  # b"HTTP/1.1"
# Other server responses could have been
# b"HTTP/0.9", b"HTTP/1.0", or b"HTTP/1.1"
```

Example 3 (sass):
```sass
import httpx

def log(event_name, info):
    print(event_name, info)

client = httpx.Client()
response = client.get("https://www.example.com/", extensions={"trace": log})
# connection.connect_tcp.started {'host': 'www.example.com', 'port': 443, 'local_address': None, 'timeout': None}
# connection.connect_tcp.complete {'return_value': <httpcore.backends.sync.SyncStream object at 0x1093f94d0>}
# connection.start_tls.started {'ssl_context': <ssl.SSLContext object at 0x1093ee750>, 'server_hostname': b'www.example.com', 'timeout': None}
# connection.start_tls.complete {'return_value': <httpcore.backends.sync.SyncStream object at 0x1093f9450>}
# http11.send_request_headers.started {'request': <Request [b'GET']>}
# http11.send_request_headers.complete {'return_value': None}
# http11.send_request_body.started {'request': <Request [b'GET']>}
# http11.send_request_body.complete {'return_value': None}
# http11.receive_response_headers.started {'request': <Request [b'GET']>}
# http11.receive_response_headers.complete {'return_value': (b'HTTP/1.1', 200, b'OK', [(b'Age', b'553715'), (b'Cache-Control', b'max-age=604800'), (b'Content-Type', b'text/html; charset=UTF-8'), (b'Date', b'Thu, 21 Oct 2021 17:08:42 GMT'), (b'Etag', b'"3147526947+ident"'), (b'Expires', b'Thu, 28 Oct 2021 17:08:42 GMT'), (b'Last-Modified', b'Thu, 17 Oct 2019 07:18:26 GMT'), (b'Server', b'ECS (nyb/1DCD)'), (b'Vary', b'Accept-Encoding'), (b'X-Cache', b'HIT'), (b'Content-Length', b'1256')])}
# http11.receive_response_body.started {'request': <Request [b'GET']>}
# http11.receive_response_body.complete {'return_value': None}
# http11.response_closed.started {}
# http11.response_closed.complete {'return_value': None}
```

Example 4 (sass):
```sass
# Connect to '185.199.108.153' but use 'www.encode.io' in the Host header,
# and use 'www.encode.io' when SSL verifying the server hostname.
client = httpx.Client()
headers = {"Host": "www.encode.io"}
extensions = {"sni_hostname": "www.encode.io"}
response = client.get(
    "https://185.199.108.153/path",
    headers=headers,
    extensions=extensions
)
```

---

## Transports

**URL:** https://www.python-httpx.org/advanced/transports

**Contents:**
- Transports
- HTTP Transport
- WSGI Transport
  - Example
  - Configuration
- ASGI Transport
  - Example
  - Configuration
  - ASGI startup and shutdown
- Custom transports

HTTPX's Client also accepts a transport argument. This argument allows you to provide a custom Transport object that will be used to perform the actual sending of the requests.

For some advanced configuration you might need to instantiate a transport class directly, and pass it to the client instance. One example is the local_address configuration which is only available via this low-level API.

Connection retries are also available via this interface. Requests will be retried the given number of times in case an httpx.ConnectError or an httpx.ConnectTimeout occurs, allowing smoother operation under flaky networks. If you need other forms of retry behaviors, such as handling read/write errors or reacting to 503 Service Unavailable, consider general-purpose tools such as tenacity.

Similarly, instantiating a transport directly provides a uds option for connecting via a Unix Domain Socket that is only available via this low-level API:

You can configure an httpx client to call directly into a Python web application using the WSGI protocol.

This is particularly useful for two main use-cases:

Here's an example of integrating against a Flask application:

For some more complex cases you might need to customize the WSGI transport. This allows you to:

You can configure an httpx client to call directly into an async Python web application using the ASGI protocol.

This is particularly useful for two main use-cases:

Let's take this Starlette application as an example:

We can make requests directly against the application, like so:

For some more complex cases you might need to customise the ASGI transport. This allows you to:

See the ASGI documentation for more details on the client and root_path keys.

It is not in the scope of HTTPX to trigger ASGI lifespan events of your app.

However it is suggested to use LifespanManager from asgi-lifespan in pair with AsyncClient.

A transport instance must implement the low-level Transport API which deals with sending a single request, and returning a response. You should either subclass httpx.BaseTransport to implement a transport to use with Client, or subclass httpx.AsyncBaseTransport to implement a transport to use with AsyncClient.

At the layer of the transport API we're using the familiar Request and Response models.

See the handle_request and handle_async_request docstrings for more details on the specifics of the Transport API.

A complete example of a custom transport implementation would be:

Or this example, which uses a custom transport and httpx.Mounts to always redirect http:// requests.

A useful pattern here is custom transport classes that wrap the default HTTP implementation. For example...

Here's another case, where we're using a round-robin across a number of different proxies...

During testing it can often be useful to be able to mock out a transport, and return pre-determined responses, rather than making actual network requests.

The httpx.MockTransport class accepts a handler function, which can be used to map requests onto pre-determined responses:

For more advanced use-cases you might want to take a look at either the third-party mocking library, RESPX, or the pytest-httpx library.

You can also mount transports against given schemes or domains, to control which transport an outgoing request should be routed via, with the same style used for specifying proxy routing.

A couple of other sketches of how you might take advantage of mounted transports...

Disabling HTTP/2 on a single given domain...

Mocking requests to a given domain:

Adding support for custom schemes:

HTTPX provides a powerful mechanism for routing requests, allowing you to write complex rules that specify which transport should be used for each request.

The mounts dictionary maps URL patterns to HTTP transports. HTTPX matches requested URLs against URL patterns to decide which transport should be used, if any. Matching is done from most specific URL patterns (e.g. https://<domain>:<port>) to least specific ones (e.g. https://).

HTTPX supports routing requests based on scheme, domain, port, or a combination of these.

Route everything through a transport...

Route HTTP requests through one transport, and HTTPS requests through another...

Proxy all requests on domain "example.com", let other requests pass through...

Proxy HTTP requests on domain "example.com", let HTTPS and other requests pass through...

Proxy all requests to "example.com" and its subdomains, let other requests pass through...

Proxy all requests to strict subdomains of "example.com", let "example.com" and other requests pass through...

Proxy HTTPS requests on port 1234 to "example.com"...

Proxy all requests on port 1234...

It is also possible to define requests that shouldn't be routed through the transport.

To do so, pass None as the proxy URL. For example...

You can combine the routing features outlined above to build complex proxy routing configurations. For example...

There are also environment variables that can be used to control the dictionary of the client mounts. They can be used to configure HTTP proxying for clients.

See documentation on HTTP_PROXY, HTTPS_PROXY, ALL_PROXY and NO_PROXY for more information.

**Examples:**

Example 1 (sass):
```sass
>>> import httpx
>>> transport = httpx.HTTPTransport(local_address="0.0.0.0")
>>> client = httpx.Client(transport=transport)
```

Example 2 (sass):
```sass
>>> import httpx
>>> transport = httpx.HTTPTransport(retries=1)
>>> client = httpx.Client(transport=transport)
```

Example 3 (json):
```json
>>> import httpx
>>> # Connect to the Docker API via a Unix Socket.
>>> transport = httpx.HTTPTransport(uds="/var/run/docker.sock")
>>> client = httpx.Client(transport=transport)
>>> response = client.get("http://docker/info")
>>> response.json()
{"ID": "...", "Containers": 4, "Images": 74, ...}
```

Example 4 (python):
```python
from flask import Flask
import httpx


app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

transport = httpx.WSGITransport(app=app)
with httpx.Client(transport=transport, base_url="http://testserver") as client:
    r = client.get("/")
    assert r.status_code == 200
    assert r.text == "Hello World!"
```

---

## Proxies

**URL:** https://www.python-httpx.org/advanced/proxies/

**Contents:**
- Proxies
- HTTP Proxies
- Authentication
- Proxy mechanisms
  - FORWARD vs TUNNEL
  - Troubleshooting proxies
- SOCKS

HTTPX supports setting up HTTP proxies via the proxy parameter to be passed on client initialization or top-level API functions like httpx.get(..., proxy=...).

To route all traffic (HTTP and HTTPS) to a proxy located at http://localhost:8030, pass the proxy URL to the client...

For more advanced use cases, pass a mounts dict. For example, to route HTTP and HTTPS requests to 2 different proxies, respectively located at http://localhost:8030, and http://localhost:8031, pass a dict of proxy URLs:

For detailed information about proxy routing, see the Routing section.

In most cases, the proxy URL for the https:// key should use the http:// scheme (that's not a typo!).

This is because HTTP proxying requires initiating a connection with the proxy server. While it's possible that your proxy supports doing it via HTTPS, most proxies only support doing it via HTTP.

For more information, see FORWARD vs TUNNEL.

Proxy credentials can be passed as the userinfo section of the proxy URL. For example:

This section describes advanced proxy concepts and functionality.

In general, the flow for making an HTTP request through a proxy is as follows:

How exactly step 2/ is performed depends on which of two proxying mechanisms is used:

If you encounter issues when setting up proxies, please refer to our Troubleshooting guide.

In addition to HTTP proxies, httpcore also supports proxies using the SOCKS protocol. This is an optional feature that requires an additional third-party library be installed before use.

You can install SOCKS support using pip:

You can now configure a client to make requests via a proxy using the SOCKS protocol:

**Examples:**

Example 1 (lua):
```lua
with httpx.Client(proxy="http://localhost:8030") as client:
    ...
```

Example 2 (lua):
```lua
proxy_mounts = {
    "http://": httpx.HTTPTransport(proxy="http://localhost:8030"),
    "https://": httpx.HTTPTransport(proxy="http://localhost:8031"),
}

with httpx.Client(mounts=proxy_mounts) as client:
    ...
```

Example 3 (lua):
```lua
with httpx.Client(proxy="http://username:password@localhost:8030") as client:
    ...
```

Example 4 (unknown):
```unknown
$ pip install httpx[socks]
```

---

## Authentication

**URL:** https://www.python-httpx.org/advanced/authentication/

**Contents:**
- Authentication
- Basic authentication
- Digest authentication
- NetRC authentication
- Custom authentication schemes

Authentication can either be included on a per-request basis...

Or configured on the client instance, ensuring that all outgoing requests will include authentication credentials...

HTTP basic authentication is an unencrypted authentication scheme that uses a simple encoding of the username and password in the request Authorization header. Since it is unencrypted it should typically only be used over https, although this is not strictly enforced.

HTTP digest authentication is a challenge-response authentication scheme. Unlike basic authentication it provides encryption, and can be used over unencrypted http connections. It requires an additional round-trip in order to negotiate the authentication.

HTTPX can be configured to use a .netrc config file for authentication.

The .netrc config file allows authentication credentials to be associated with specified hosts. When a request is made to a host that is found in the netrc file, the username and password will be included using HTTP basic authentication.

Some examples of configuring .netrc authentication with httpx.

Use the default .netrc file in the users home directory:

Use an explicit path to a .netrc file:

Use the NETRC environment variable to configure a path to the .netrc file, or fallback to the default.

The NetRCAuth() class uses the netrc.netrc() function from the Python standard library. See the documentation there for more details on exceptions that may be raised if the .netrc file is not found, or cannot be parsed.

When issuing requests or instantiating a client, the auth argument can be used to pass an authentication scheme to use. The auth argument may be one of the following...

The most involved of these is the last, which allows you to create authentication flows involving one or more requests. A subclass of httpx.Auth should implement def auth_flow(request), and yield any requests that need to be made...

If the auth flow requires more than one request, you can issue multiple yields, and obtain the response in each case...

Custom authentication classes are designed to not perform any I/O, so that they may be used with both sync and async client instances. If you are implementing an authentication scheme that requires the request body, then you need to indicate this on the class using a requires_request_body property.

You will then be able to access request.content inside the .auth_flow() method.

Similarly, if you are implementing a scheme that requires access to the response body, then use the requires_response_body property. You will then be able to access response body properties and methods such as response.content, response.text, response.json(), etc.

If you do need to perform I/O other than HTTP requests, such as accessing a disk-based cache, or you need to use concurrency primitives, such as locks, then you should override .sync_auth_flow() and .async_auth_flow() (instead of .auth_flow()). The former will be used by httpx.Client, while the latter will be used by httpx.AsyncClient.

If you only want to support one of the two methods, then you should still override it, but raise an explicit RuntimeError.

**Examples:**

Example 1 (sass):
```sass
>>> auth = httpx.BasicAuth(username="username", password="secret")
>>> client = httpx.Client()
>>> response = client.get("https://www.example.com/", auth=auth)
```

Example 2 (sass):
```sass
>>> auth = httpx.BasicAuth(username="username", password="secret")
>>> client = httpx.Client(auth=auth)
>>> response = client.get("https://www.example.com/")
```

Example 3 (sass):
```sass
>>> auth = httpx.BasicAuth(username="finley", password="secret")
>>> client = httpx.Client(auth=auth)
>>> response = client.get("https://httpbin.org/basic-auth/finley/secret")
>>> response
<Response [200 OK]>
```

Example 4 (sass):
```sass
>>> auth = httpx.DigestAuth(username="olivia", password="secret")
>>> client = httpx.Client(auth=auth)
>>> response = client.get("https://httpbin.org/digest-auth/auth/olivia/secret")
>>> response
<Response [200 OK]>
>>> response.history
[<Response [401 UNAUTHORIZED]>]
```

---

## Resource Limits

**URL:** https://www.python-httpx.org/advanced/resource-limits/

**Contents:**
- Resource Limits

You can control the connection pool size using the limits keyword argument on the client. It takes instances of httpx.Limits which define:

**Examples:**

Example 1 (sass):
```sass
limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
client = httpx.Client(limits=limits)
```

---

## Async Support

**URL:** https://www.python-httpx.org/async/

**Contents:**
- Async Support
- Making Async requests
- API Differences
  - Making requests
  - Opening and closing clients
  - Streaming responses
  - Streaming requests
  - Explicit transport instances
- Supported async environments
  - AsyncIO

HTTPX offers a standard synchronous API by default, but also gives you the option of an async client if you need it.

Async is a concurrency model that is far more efficient than multi-threading, and can provide significant performance benefits and enable the use of long-lived network connections such as WebSockets.

If you're working with an async web framework then you'll also want to use an async client for sending outgoing HTTP requests.

To make asynchronous requests, you'll need an AsyncClient.

Use IPython or Python 3.9+ with python -m asyncio to try this code interactively, as they support executing async/await expressions in the console.

If you're using an async client then there are a few bits of API that use async methods.

The request methods are all async, so you should use response = await client.get(...) style for all of the following:

Use async with httpx.AsyncClient() if you want a context-managed client...

In order to get the most benefit from connection pooling, make sure you're not instantiating multiple client instances - for example by using async with inside a "hot loop". This can be achieved either by having a single scoped client that's passed throughout wherever it's needed, or by having a single global client instance.

Alternatively, use await client.aclose() if you want to close a client explicitly:

The AsyncClient.stream(method, url, ...) method is an async context block.

The async response streaming methods are:

For situations when context block usage is not practical, it is possible to enter "manual mode" by sending a Request instance using client.send(..., stream=True).

Example in the context of forwarding the response to a streaming web endpoint with Starlette:

When using this "manual streaming mode", it is your duty as a developer to make sure that Response.aclose() is called eventually. Failing to do so would leave connections open, most likely resulting in resource leaks down the line.

When sending a streaming request body with an AsyncClient instance, you should use an async bytes generator instead of a bytes generator:

When instantiating a transport instance directly, you need to use httpx.AsyncHTTPTransport.

HTTPX supports either asyncio or trio as an async environment.

It will auto-detect which of those two to use as the backend for socket operations and concurrency primitives.

AsyncIO is Python's built-in library for writing concurrent code with the async/await syntax.

Trio is an alternative async library, designed around the the principles of structured concurrency.

The trio package must be installed to use the Trio backend.

AnyIO is an asynchronous networking and concurrency library that works on top of either asyncio or trio. It blends in with native libraries of your chosen backend (defaults to asyncio).

For details on calling directly into ASGI applications, see the ASGITransport docs.

**Examples:**

Example 1 (lua):
```lua
>>> async with httpx.AsyncClient() as client:
...     r = await client.get('https://www.example.com/')
...
>>> r
<Response [200 OK]>
```

Example 2 (lua):
```lua
async with httpx.AsyncClient() as client:
    ...
```

Example 3 (lua):
```lua
client = httpx.AsyncClient()
...
await client.aclose()
```

Example 4 (lua):
```lua
>>> client = httpx.AsyncClient()
>>> async with client.stream('GET', 'https://www.example.com/') as response:
...     async for chunk in response.aiter_bytes():
...         ...
```

---

## Developer Interface

**URL:** https://www.python-httpx.org/api/

**Contents:**
- Developer Interface
- Helper Functions
- Client
- AsyncClient
- Response
- Request
- URL
- Headers
- Cookies
- Proxy

Only use these functions if you're testing HTTPX in a console or making a small number of requests. Using a Client will enable HTTP/2 and connection pooling for more efficient and long-lived connections.

Sends an HTTP request.

Parameters: See httpx.request.

Note that the data, files, json and content parameters are not available on this function, as GET requests should not include a request body.

Sends an OPTIONS request.

Parameters: See httpx.request.

Note that the data, files, json and content parameters are not available on this function, as OPTIONS requests should not include a request body.

Sends a HEAD request.

Parameters: See httpx.request.

Note that the data, files, json and content parameters are not available on this function, as HEAD requests should not include a request body.

Sends a POST request.

Parameters: See httpx.request.

Parameters: See httpx.request.

Sends a PATCH request.

Parameters: See httpx.request.

Sends a DELETE request.

Parameters: See httpx.request.

Note that the data, files, json and content parameters are not available on this function, as DELETE requests should not include a request body.

Alternative to httpx.request() that streams the response body instead of loading it into memory at once.

Parameters: See httpx.request.

See also: Streaming Responses

An HTTP client, with connection pooling, HTTP/2, redirects, cookie persistence, etc.

It can be shared between threads.

HTTP headers to include when sending requests.

Cookie values to include when sending requests.

Query parameters to include in the URL when sending requests.

Authentication class used when none is passed at the request-level.

See also Authentication.

Build and send a request.

See Client.build_request(), Client.send() and Merging of configuration for how the various parameters are merged with client-level configuration.

Parameters: See httpx.request.

Parameters: See httpx.request.

Send an OPTIONS request.

Parameters: See httpx.request.

Parameters: See httpx.request.

Parameters: See httpx.request.

Send a PATCH request.

Parameters: See httpx.request.

Send a DELETE request.

Parameters: See httpx.request.

Alternative to httpx.request() that streams the response body instead of loading it into memory at once.

Parameters: See httpx.request.

See also: Streaming Responses

Build and return a request instance.

See also: Request instances

The request is sent as-is, unmodified.

Typically you'll want to build one with Client.build_request() so that any client-level configuration is merged into the request, but passing an explicit httpx.Request() is supported as well.

See also: Request instances

Close transport and proxies.

An asynchronous HTTP client, with connection pooling, HTTP/2, redirects, cookie persistence, etc.

It can be shared between tasks.

HTTP headers to include when sending requests.

Cookie values to include when sending requests.

Query parameters to include in the URL when sending requests.

Authentication class used when none is passed at the request-level.

See also Authentication.

Build and send a request.

See AsyncClient.build_request(), AsyncClient.send() and Merging of configuration for how the various parameters are merged with client-level configuration.

Parameters: See httpx.request.

Parameters: See httpx.request.

Send an OPTIONS request.

Parameters: See httpx.request.

Parameters: See httpx.request.

Parameters: See httpx.request.

Send a PATCH request.

Parameters: See httpx.request.

Send a DELETE request.

Parameters: See httpx.request.

Alternative to httpx.request() that streams the response body instead of loading it into memory at once.

Parameters: See httpx.request.

See also: Streaming Responses

Build and return a request instance.

See also: Request instances

The request is sent as-is, unmodified.

Typically you'll want to build one with AsyncClient.build_request() so that any client-level configuration is merged into the request, but passing an explicit httpx.Request() is supported as well.

See also: Request instances

Close transport and proxies.

An HTTP request. Can be constructed explicitly for more control over exactly what gets sent over the wire.

A normalized, IDNA supporting URL.

A case-insensitive multi-dict.

A dict-like cookie store.

A configuration of the proxy server.

**Examples:**

Example 1 (jsx):
```jsx
>>> import httpx
>>> response = httpx.request('GET', 'https://httpbin.org/get')
>>> response
<Response [200 OK]>
```

Example 2 (unknown):
```unknown
>>> client = httpx.Client()
>>> response = client.get('https://example.org')
```

Example 3 (lua):
```lua
request = client.build_request(...)
response = client.send(request, ...)
```

Example 4 (python):
```python
>>> async with httpx.AsyncClient() as client:
>>>     response = await client.get('https://example.org')
```

---

## Transports

**URL:** https://www.python-httpx.org/advanced/transports/

**Contents:**
- Transports
- HTTP Transport
- WSGI Transport
  - Example
  - Configuration
- ASGI Transport
  - Example
  - Configuration
  - ASGI startup and shutdown
- Custom transports

HTTPX's Client also accepts a transport argument. This argument allows you to provide a custom Transport object that will be used to perform the actual sending of the requests.

For some advanced configuration you might need to instantiate a transport class directly, and pass it to the client instance. One example is the local_address configuration which is only available via this low-level API.

Connection retries are also available via this interface. Requests will be retried the given number of times in case an httpx.ConnectError or an httpx.ConnectTimeout occurs, allowing smoother operation under flaky networks. If you need other forms of retry behaviors, such as handling read/write errors or reacting to 503 Service Unavailable, consider general-purpose tools such as tenacity.

Similarly, instantiating a transport directly provides a uds option for connecting via a Unix Domain Socket that is only available via this low-level API:

You can configure an httpx client to call directly into a Python web application using the WSGI protocol.

This is particularly useful for two main use-cases:

Here's an example of integrating against a Flask application:

For some more complex cases you might need to customize the WSGI transport. This allows you to:

You can configure an httpx client to call directly into an async Python web application using the ASGI protocol.

This is particularly useful for two main use-cases:

Let's take this Starlette application as an example:

We can make requests directly against the application, like so:

For some more complex cases you might need to customise the ASGI transport. This allows you to:

See the ASGI documentation for more details on the client and root_path keys.

It is not in the scope of HTTPX to trigger ASGI lifespan events of your app.

However it is suggested to use LifespanManager from asgi-lifespan in pair with AsyncClient.

A transport instance must implement the low-level Transport API which deals with sending a single request, and returning a response. You should either subclass httpx.BaseTransport to implement a transport to use with Client, or subclass httpx.AsyncBaseTransport to implement a transport to use with AsyncClient.

At the layer of the transport API we're using the familiar Request and Response models.

See the handle_request and handle_async_request docstrings for more details on the specifics of the Transport API.

A complete example of a custom transport implementation would be:

Or this example, which uses a custom transport and httpx.Mounts to always redirect http:// requests.

A useful pattern here is custom transport classes that wrap the default HTTP implementation. For example...

Here's another case, where we're using a round-robin across a number of different proxies...

During testing it can often be useful to be able to mock out a transport, and return pre-determined responses, rather than making actual network requests.

The httpx.MockTransport class accepts a handler function, which can be used to map requests onto pre-determined responses:

For more advanced use-cases you might want to take a look at either the third-party mocking library, RESPX, or the pytest-httpx library.

You can also mount transports against given schemes or domains, to control which transport an outgoing request should be routed via, with the same style used for specifying proxy routing.

A couple of other sketches of how you might take advantage of mounted transports...

Disabling HTTP/2 on a single given domain...

Mocking requests to a given domain:

Adding support for custom schemes:

HTTPX provides a powerful mechanism for routing requests, allowing you to write complex rules that specify which transport should be used for each request.

The mounts dictionary maps URL patterns to HTTP transports. HTTPX matches requested URLs against URL patterns to decide which transport should be used, if any. Matching is done from most specific URL patterns (e.g. https://<domain>:<port>) to least specific ones (e.g. https://).

HTTPX supports routing requests based on scheme, domain, port, or a combination of these.

Route everything through a transport...

Route HTTP requests through one transport, and HTTPS requests through another...

Proxy all requests on domain "example.com", let other requests pass through...

Proxy HTTP requests on domain "example.com", let HTTPS and other requests pass through...

Proxy all requests to "example.com" and its subdomains, let other requests pass through...

Proxy all requests to strict subdomains of "example.com", let "example.com" and other requests pass through...

Proxy HTTPS requests on port 1234 to "example.com"...

Proxy all requests on port 1234...

It is also possible to define requests that shouldn't be routed through the transport.

To do so, pass None as the proxy URL. For example...

You can combine the routing features outlined above to build complex proxy routing configurations. For example...

There are also environment variables that can be used to control the dictionary of the client mounts. They can be used to configure HTTP proxying for clients.

See documentation on HTTP_PROXY, HTTPS_PROXY, ALL_PROXY and NO_PROXY for more information.

**Examples:**

Example 1 (sass):
```sass
>>> import httpx
>>> transport = httpx.HTTPTransport(local_address="0.0.0.0")
>>> client = httpx.Client(transport=transport)
```

Example 2 (sass):
```sass
>>> import httpx
>>> transport = httpx.HTTPTransport(retries=1)
>>> client = httpx.Client(transport=transport)
```

Example 3 (json):
```json
>>> import httpx
>>> # Connect to the Docker API via a Unix Socket.
>>> transport = httpx.HTTPTransport(uds="/var/run/docker.sock")
>>> client = httpx.Client(transport=transport)
>>> response = client.get("http://docker/info")
>>> response.json()
{"ID": "...", "Containers": 4, "Images": 74, ...}
```

Example 4 (python):
```python
from flask import Flask
import httpx


app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

transport = httpx.WSGITransport(app=app)
with httpx.Client(transport=transport, base_url="http://testserver") as client:
    r = client.get("/")
    assert r.status_code == 200
    assert r.text == "Hello World!"
```

---

## Clients

**URL:** https://www.python-httpx.org/advanced/clients/

**Contents:**
- Clients
- Why use a Client?
- Usage
- Making requests
- Sharing configuration across requests
- Merging of configuration
- Other Client-only configuration options
- Request instances
- Monitoring download progress
- Monitoring upload progress

If you are coming from Requests, httpx.Client() is what you can use instead of requests.Session().

If you do anything more than experimentation, one-off scripts, or prototypes, then you should use a Client instance.

More efficient usage of network resources

When you make requests using the top-level API as documented in the Quickstart guide, HTTPX has to establish a new connection for every single request (connections are not reused). As the number of requests to a host increases, this quickly becomes inefficient.

On the other hand, a Client instance uses HTTP connection pooling. This means that when you make several requests to the same host, the Client will reuse the underlying TCP connection, instead of recreating one for every single request.

This can bring significant performance improvements compared to using the top-level API, including:

Client instances also support features that aren't available at the top-level API, such as:

The other sections on this page go into further detail about what you can do with a Client instance.

The recommended way to use a Client is as a context manager. This will ensure that connections are properly cleaned up when leaving the with block:

Alternatively, you can explicitly close the connection pool without block-usage using .close():

Once you have a Client, you can send requests using .get(), .post(), etc. For example:

These methods accept the same arguments as httpx.get(), httpx.post(), etc. This means that all features documented in the Quickstart guide are also available at the client level.

For example, to send a request with custom headers:

Clients allow you to apply configuration to all outgoing requests by passing parameters to the Client constructor.

For example, to apply a set of custom headers on every request:

When a configuration option is provided at both the client-level and request-level, one of two things can happen:

If you need finer-grained control on the merging of client-level and request-level parameters, see Request instances.

Additionally, Client accepts some configuration options that aren't available at the request level.

For example, base_url allows you to prepend an URL to all outgoing requests:

For a list of all available client parameters, see the Client API reference.

For maximum control on what gets sent over the wire, HTTPX supports building explicit Request instances:

To dispatch a Request instance across to the network, create a Client instance and use .send():

If you need to mix client-level and request-level options in a way that is not supported by the default Merging of parameters, you can use .build_request() and then make arbitrary modifications to the Request instance. For example:

If you need to monitor download progress of large responses, you can use response streaming and inspect the response.num_bytes_downloaded property.

This interface is required for properly determining download progress, because the total number of bytes returned by response.content or response.iter_content() will not always correspond with the raw content length of the response if HTTP response compression is being used.

For example, showing a progress bar using the tqdm library while a response is being downloaded could be done like this…

Or an alternate example, this time using the rich library…

If you need to monitor upload progress of large responses, you can use request content generator streaming.

For example, showing a progress bar using the tqdm library.

As mentioned in the quickstart multipart file encoding is available by passing a dictionary with the name of the payloads as keys and either tuple of elements or a file-like object or a string as values.

More specifically, if a tuple is used as a value, it must have between 2 and 3 elements:

It is safe to upload large files this way. File uploads are streaming by default, meaning that only one chunk will be loaded into memory at a time.

Non-file data fields can be included in the multipart form using by passing them to data=....

You can also send multiple files in one go with a multiple file field form. To do that, pass a list of (field, <file>) items instead of a dictionary, allowing you to pass multiple items with the same field. For instance this request sends 2 files, foo.png and bar.png in one request on the images form field:

**Examples:**

Example 1 (lua):
```lua
with httpx.Client() as client:
    ...
```

Example 2 (lua):
```lua
client = httpx.Client()
try:
    ...
finally:
    client.close()
```

Example 3 (lua):
```lua
>>> with httpx.Client() as client:
...     r = client.get('https://example.com')
...
>>> r
<Response [200 OK]>
```

Example 4 (lua):
```lua
>>> with httpx.Client() as client:
...     headers = {'X-Custom': 'value'}
...     r = client.get('https://example.com', headers=headers)
...
>>> r.request.headers['X-Custom']
'value'
```

---

## HTTP/2

**URL:** https://www.python-httpx.org/http2/

**Contents:**
- HTTP/2
- Enabling HTTP/2
- Inspecting the HTTP version

HTTP/2 is a major new iteration of the HTTP protocol, that provides a far more efficient transport, with potential performance benefits. HTTP/2 does not change the core semantics of the request or response, but alters the way that data is sent to and from the server.

Rather than the text format that HTTP/1.1 uses, HTTP/2 is a binary format. The binary format provides full request and response multiplexing, and efficient compression of HTTP headers. The stream multiplexing means that where HTTP/1.1 requires one TCP stream for each concurrent request, HTTP/2 allows a single TCP stream to handle multiple concurrent requests.

HTTP/2 also provides support for functionality such as response prioritization, and server push.

For a comprehensive guide to HTTP/2 you may want to check out "http2 explained".

When using the httpx client, HTTP/2 support is not enabled by default, because HTTP/1.1 is a mature, battle-hardened transport layer, and our HTTP/1.1 implementation may be considered the more robust option at this point in time. It is possible that a future version of httpx may enable HTTP/2 support by default.

If you're issuing highly concurrent requests you might want to consider trying out our HTTP/2 support. You can do so by first making sure to install the optional HTTP/2 dependencies...

And then instantiating a client with HTTP/2 support enabled:

You can also instantiate a client as a context manager, to ensure that all HTTP connections are nicely scoped, and will be closed once the context block is exited.

HTTP/2 support is available on both Client and AsyncClient, although it's typically more useful in async contexts if you're issuing lots of concurrent requests.

Enabling HTTP/2 support on the client does not necessarily mean that your requests and responses will be transported over HTTP/2, since both the client and the server need to support HTTP/2. If you connect to a server that only supports HTTP/1.1 the client will use a standard HTTP/1.1 connection instead.

You can determine which version of the HTTP protocol was used by examining the .http_version property on the response.

**Examples:**

Example 1 (unknown):
```unknown
$ pip install httpx[http2]
```

Example 2 (lua):
```lua
client = httpx.AsyncClient(http2=True)
...
```

Example 3 (lua):
```lua
async with httpx.AsyncClient(http2=True) as client:
    ...
```

Example 4 (lua):
```lua
client = httpx.AsyncClient(http2=True)
response = await client.get(...)
print(response.http_version)  # "HTTP/1.0", "HTTP/1.1", or "HTTP/2".
```

---

## SSL

**URL:** https://www.python-httpx.org/advanced/ssl/

**Contents:**
- SSL
  - Enabling and disabling verification
  - Configuring client instances
  - Client side certificates
  - Working with SSL_CERT_FILE and SSL_CERT_DIR
  - Making HTTPS requests to a local server

When making a request over HTTPS, HTTPX needs to verify the identity of the requested host. To do this, it uses a bundle of SSL certificates (a.k.a. CA bundle) delivered by a trusted certificate authority (CA).

By default httpx will verify HTTPS connections, and raise an error for invalid SSL cases...

You can disable SSL verification completely and allow insecure requests...

If you're using a Client() instance you should pass any verify=<...> configuration when instantiating the client.

By default the certifi CA bundle is used for SSL verification.

For more complex configurations you can pass an SSL Context instance...

Using the truststore package to support system certificate stores...

Loding an alternative certificate verification store using the standard SSL context API...

Client side certificates allow a remote server to verify the client. They tend to be used within private organizations to authenticate requests to remote servers.

You can specify client-side certificates, using the .load_cert_chain() API...

httpx does respect the SSL_CERT_FILE and SSL_CERT_DIR environment variables by default. For details, refer to the section on the environment variables page.

When making requests to local servers, such as a development server running on localhost, you will typically be using unencrypted HTTP connections.

If you do need to make HTTPS connections to a local server, for example to test an HTTPS-only service, you will need to create and use your own certificates. Here's one way to do it...

**Examples:**

Example 1 (swift):
```swift
>>> httpx.get("https://expired.badssl.com/")
httpx.ConnectError: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:997)
```

Example 2 (sass):
```sass
>>> httpx.get("https://expired.badssl.com/", verify=False)
<Response [200 OK]>
```

Example 3 (sass):
```sass
import certifi
import httpx
import ssl

# This SSL context is equivelent to the default `verify=True`.
ctx = ssl.create_default_context(cafile=certifi.where())
client = httpx.Client(verify=ctx)
```

Example 4 (sass):
```sass
import ssl
import truststore
import httpx

# Use system certificate stores.
ctx = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
client = httpx.Client(verify=ctx)
```

---

## Timeouts

**URL:** https://www.python-httpx.org/advanced/timeouts/

**Contents:**
- Timeouts
- Setting and disabling timeouts
- Setting a default timeout on a client
- Fine tuning the configuration

HTTPX is careful to enforce timeouts everywhere by default.

The default behavior is to raise a TimeoutException after 5 seconds of network inactivity.

You can set timeouts for an individual request:

Or disable timeouts for an individual request:

You can set a timeout on a client instance, which results in the given timeout being used as the default for requests made with this client:

HTTPX also allows you to specify the timeout behavior in more fine grained detail.

There are four different types of timeouts that may occur. These are connect, read, write, and pool timeouts.

You can configure the timeout behavior for any of these values...

**Examples:**

Example 1 (sass):
```sass
# Using the top-level API:
httpx.get('http://example.com/api/v1/example', timeout=10.0)

# Using a client instance:
with httpx.Client() as client:
    client.get("http://example.com/api/v1/example", timeout=10.0)
```

Example 2 (sass):
```sass
# Using the top-level API:
httpx.get('http://example.com/api/v1/example', timeout=None)

# Using a client instance:
with httpx.Client() as client:
    client.get("http://example.com/api/v1/example", timeout=None)
```

Example 3 (sass):
```sass
client = httpx.Client()              # Use a default 5s timeout everywhere.
client = httpx.Client(timeout=10.0)  # Use a default 10s timeout everywhere.
client = httpx.Client(timeout=None)  # Disable all timeouts by default.
```

Example 4 (sass):
```sass
# A client with a 60s timeout for connecting, and a 10s timeout elsewhere.
timeout = httpx.Timeout(10.0, connect=60.0)
client = httpx.Client(timeout=timeout)

response = client.get('http://example.com/')
```

---
