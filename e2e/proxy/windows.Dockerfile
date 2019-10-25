FROM python:3.8.0-windowsservercore-1803

RUN pip install mitmproxy
EXPOSE 8080
COPY runproxy.py runproxy.py
CMD ["mitmdump", "-s", "runproxy.py"]
