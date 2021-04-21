### Kraken app configured with opentelemetry

App to demo possible issue in express otel auto-instrumentation when used with a KrakenJS app

#### Running the app
```
git clone git@github.com:maxmil7/vanillakraken.git
cd krakenotel
npm i
node .
```

- Access the app in the browser: http://localhost:7000/myapp
- In console, check the incoming http span, it will have name as:  
`GET /myapp/myapp/myapp/myapp/myapp/myapp/myapp/myapp/myapp`

Optionally, you can start a zipkin server and view the trace in zipkin UI. Name of http span would be similar to above.