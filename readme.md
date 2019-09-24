# wav生成

翻出来练手

按十二平均律计算出频率生成wav（等比计算，跟实际音高还是有差距），模拟乐器
音效计算需要根据乐器音波图像进行拟合，计算量比较大&不同音高下相同乐器函数也不一样。调完piano就跪了...

音色可用：
- 8bit
- tuningFork
- piano

## 使用
```
let engine = new Engine({ effect: 'piano', len: 4});

let engine = new Engine({ effect: (w, t, spec) => {return sin(w * t)}, len: 5});

engine
    .play('G2')
    .play('C3 E3 G2', {delay: 1000})
    .play('D3 F3 A2', {delay: 2000})
    .play('E3 G3 B2', {delay: 3000})

engine
    .play('G2', {}, function callback(){})

engine
    .audio('G3')

```

## TODO
- bitsPerSample 使用16位拼合blob出现问题，暂时只能使用8bit
- 音色拟合函数补完，方案缺失
- audioContext调试
- 找天改成webassembly试试（5年后）

