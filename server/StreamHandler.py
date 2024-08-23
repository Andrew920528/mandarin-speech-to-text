class StreamHandler:
    END_TOKEN = "[END]"

    def __init__(self, out_stream):
        self.out_stream = out_stream

    def end_stream(self):
        self.out_stream.put(StreamHandler.END_TOKEN)

    def add_to_stream(self, data: any, ):
        self.out_stream.put(data)

    def yield_stream(self):
        """yields the stream from the queue until it is emptied

        Yields:
            str: chunks of the stream
        """
        delimiter = "|T|"
        while True:
            result: str = self.out_stream.get()
            if result is None or result == StreamHandler.END_TOKEN:
                break
            yield result + delimiter