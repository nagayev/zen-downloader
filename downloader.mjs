import cheerio from 'cheerio';
import fs from 'fs';
import child_process from 'child_process';

async function main(){
    const url = process.argv[2];
    console.log(`url is ${url}`);
    console.log(`Loading html document...`);
    child_process.execSync(`curl ${url} > tmp.html`);
    const $ = cheerio.load(fs.readFileSync('tmp.html').toString('utf-8'));
    const contentDiv = $('.content');
    let result = contentDiv.next().html();
    console.log(`Searching m3u8...`);
    const m3u8 = result.indexOf('m3u8');
    let pos = m3u8;
    while(true){
        if (result[pos]+result[pos-1]+result[pos-2]+result[pos-3]=="ptth"){
            console.log('Done!');
            break;
        }
        pos--;
    }
    const m3u8_url = result.slice(pos-3,m3u8+4);
    console.log(`m3u8 url is ${m3u8_url}`);
    console.log(`Calling ffmpeg...`);
    child_process.execSync(`ffmpeg -i ${m3u8_url} -c copy -bsf:a aac_adtstoasc "output.mp4"`);
}
main();
