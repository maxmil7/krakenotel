
let globalTracer;
const otel = () => {
    if (globalTracer)
        return globalTracer;

    const { NodeTracerProvider } = require('@opentelemetry/node');
    const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
    const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
    const { registerInstrumentations } = require('@opentelemetry/instrumentation');
    const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
    const { ExpressInstrumentation, ExpressLayerType } = require('@opentelemetry/instrumentation-express');
    const { B3Propagator, B3InjectEncoding } = require('@opentelemetry/propagator-b3');
    const serviceName = require('./package.json').name;

    const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel['DEBUG']);

    const provider = new NodeTracerProvider();


    console.log('initializing provider');
    provider.register({
        propagator: new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER })
    });

    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(
                    {
                        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.REQUEST_HANDLER]
                    }
                )
        ],
        tracerProvider: provider,
      });


    const exporter = new ZipkinExporter({ serviceName });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    globalTracer = provider.getTracer('default');
    return globalTracer;
}

module.exports = otel();