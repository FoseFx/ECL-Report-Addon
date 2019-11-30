from mitmproxy import http

def request(flow: http.HTTPFlow):
    request = flow.request
    host_name = request.pretty_host
    if is_captcha(request):
        print("FF: CAPTCHA request")
        print_text_of_req(request)
    if is_faceit_host(host_name):
        print("FF: url: " + request.pretty_url)
        print_text_of_req(request)
        if "https://api.faceit.com/auth/v1/oauth/token" == request.pretty_url:
            flow.response = http.HTTPResponse.make(
            418, b"I'm a teapot",
        )

def is_faceit_host(hostname):
    return "api.faceit.com" in hostname

def is_captcha(request):
    return "https://www.google.com/recaptcha/api2/userverify?k=" in request.pretty_url

def print_text_of_req(request):
    try:
        print("FF: text: " + request.get_text)
    except ValueError as e:
        print("ff: ValueError while decoding response: ")
        print(e)
