/*
    wav http://baike.baidu.com/link?url=ZDGhS9R8eBYqAY7p3N1oFJrqjBvB8Rqt9SNGaKbW54Z8WozKwV8KYdPwJ4YQky6L
*/

const header = {
    'RIFF_ID'       : [0x52,0x49,0x46,0x46],
    'chunkSize'     : 0,
    'WAVE_ID'       : [0x57,0x41,0x56,0x45],
    'FMT_ID'        : [0x66,0x6d,0x74,0x20],
    'filterByte'    : 0x10,
    'formatType'    : 1,
    'numChannels'   : 2,
    'sampleRate'    : 44100,
    'byteRate'      : 0,
    'blockAlign'    : 0,
    'bitsPerSample' : 8,
    'fact_ID'       : [0x64,0x61,0x74,0x61],
    'size'          : 4
};
export default function(source, customHeader = {}){
    const bitType = get('bitsPerSample') === 16 ? 4 : 3;
    const blockAlign = (get('numChannels') * get('bitsPerSample')) >> bitType;
    const byteRate = blockAlign * get('sampleRate');
    const size = source.length * (get('bitsPerSample') >> bitType);
    const chunkSize = 36 + size;
    const dataBit = 0;

    const byteCount = 0;

    let data = new Uint8Array(size * (bitType - 2) + 44);
    set(get('RIFF_ID'), 4);
    set(chunkSize, 4);
    set(get('WAVE_ID'), 4);
    set(get('FMT_ID'), 4);
    set(get('filterByte'), 4);
    set(get('formatType'), 2);
    set(get('numChannels'), 2);
    set(get('sampleRate'), 4);
    set(byteRate, 4);
    set(blockAlign, 2);
    set(get('bitsPerSample'), 2);
    set(get('fact_ID'), 4);
    set(size, 4);

    if(bitType == 4){
        for(var i = 0, j = data.length; i<j; i++){
            set(data[i], 2, true);
        }
    }
    else{
        set(data);
    }
    
    return new Blob([].concat(this.data), {'type': 'audio/wav'});

    function get(key){
        return Object.hasProperty(customHeader, key) ? customHeader[key] : header[key];
    }
    function set(d, len = d.length, reverse = false){
        if(Array.isArray(d)){
            data.set(d, byteCount);
            byteCount += len;
            return;
        }
        let count = 0;
        while(len--){
            data[byteCount + (reverse ? len : 0)] = (d >> count * 8) & 0xFF;
            count++;
            byteCount++;
        }
    }
}
