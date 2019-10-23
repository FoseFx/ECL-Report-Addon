from mitmproxy import http

def request(flow: http.HTTPFlow):
    if flow.request.pretty_host == "faceit.com":
    	flow.response = http.HTTPResponse.make(
            418, b"I'm a teapot",
        )
