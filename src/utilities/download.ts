import streamSaver from 'streamsaver'

/**
 * Utility method which will trigger a file download on the users machine
 * @param fileName: the name of the file to be downloaded
 * @param fileData: the file data to be downloaded by the user
 */
export default function download(fileName: string, fileData: string) {
    const uInt8 = new TextEncoder().encode(fileData);

    // streamSaver.createWriteStream() returns a writable byte stream
    // The WritableStream only accepts Uint8Array chunks
    // (no other typed arrays, arrayBuffers or strings are allowed)
    const fileStream = streamSaver.createWriteStream(fileName, {
        size: uInt8.byteLength, // (optional file size) Will show progress
        writableStrategy: undefined, // (optional)
        readableStrategy: undefined  // (optional)
    });

    const writer = fileStream.getWriter()
    writer.write(uInt8)
    writer.close()
}