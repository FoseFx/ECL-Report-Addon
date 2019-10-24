FROM python:3.8.0-windowsservercore-ltsc2016

RUN pip install mitmproxy
EXPOSE 8080
COPY runproxy.py runproxy.py
CMD ["mitmdump", "-s", "runproxy.py"]
