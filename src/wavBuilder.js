/*
    wav https://www.cnblogs.com/ranson7zop/p/7657874.html
*/

const format = {
    /* RIFF chunk description
    ---------------------------------------------------- */
    'RIFF_ID': charCodeFormat('RIFF'),
    // 从下一个字段首地址开始到文件末尾的总字节数。该字段的数值加 8 为当前文件的实际长度
    'chunkSize': 0,
    'WAVE_ID': charCodeFormat('WAVE'),
    /* FMT sub-chunk, fommat of the sound infomation in the data sub-chunk
    ---------------------------------------------------- */
    'FMT_ID': charCodeFormat('fmt '),
    // [ 16 | 18 | 20 | 40 | ... ]
    'filterByte': 16, 
    // 常见的 WAV 文件使用 PCM 脉冲编码调制格式, 1
    'formatType': 1, 
    // 声道，[ 1 | 2 ]
    'numChannels': 2, 
    // 采样频率,  11025, 22050 和 44100 kHz
    'sampleRate': 44100, 
    // 数据传输速率, 声道数numChannels×采样频率sampleRate×每样本的数据位数bitsPerSample/8, 利用此值可以估计缓冲区的大小
    'byteRate': 0, 
    // 数据块对齐单位, 声道数numChannels×位数bitsPerSample/8
    'blockAlign': 4, 
    // 采样位数	存储每个采样值所用的二进制数位数。常见的位数有 4、8、12、16、24、32
    'bitsPerSample': 16,
    /* data sub-chunk
    ---------------------------------------------------- */
    'DATA_ID': charCodeFormat('data'),
    'size': 4,
    'data': 0,
};
function wavBuilder(source, customFormat = {}) {
    const size = source.length;
    let byteCount = 0;

    let data = new Uint8Array(size + 44);
    set(get('RIFF_ID'), 4);
    set(size + 36, 4);
    set(get('WAVE_ID'), 4);
    set(get('FMT_ID'), 4);
    set(get('filterByte'), 4);
    set(get('formatType'), 2);
    set(get('numChannels'), 2);
    set(get('sampleRate'), 4);
    set(get('numChannels') * get('sampleRate') * get('bitsPerSample') / 8, 4);
    set(get('numChannels') * get('bitsPerSample') / 8, 2);
    set(get('bitsPerSample'), 2);
    set(get('DATA_ID'), 4);
    set(size, 4);

    set(source);
    return new Blob([].concat(data), { 'type': 'audio/wav' });

    function get(key) {
        return Object.hasOwnProperty(customFormat, key) ? customFormat[key] : format[key];
    }
    function set(d, len = d.length) {
        if (Array.isArray(d) || d.buffer) {
            data.set(d, byteCount);
            byteCount += len;
            return;
        }
        let count = 0;
        while (len--) {
            data[byteCount] = (d >> count * 8) & 0xFF;
            count++;
            byteCount++;
        }
    }
}


function charCodeFormat(string){
    return string.split('').map((char, i) => string.charCodeAt(i));
}
