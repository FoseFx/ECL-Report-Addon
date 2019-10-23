FROM mitmproxy/mitmproxy
EXPOSE 8080
COPY runproxy.py runproxy.py
CMD ["mitmdump", "-s", "runproxy.py"]
# docker run --rm -p 8888:8080 -v $(pwd)/shared:/home/mitmproxy/.mitmproxy/ addon-proxy
