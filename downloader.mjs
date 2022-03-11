import cheerio from 'cheerio';
import fs from 'fs';
import child_process from 'child_process';

async function main(){
    if (process.argv.length!==3){
        console.error(`Invalid script usage!`);
        console.log(`Usage: node downloader.mjs video_url`);
        process.exit(1);
    }
    const url = process.argv[2];
    console.log(`url is ${url}`);
    console.log(`Loading html document...`);
    child_process.execSync(`curl ${url} > tmp.html`);
    const $ = cheerio.load(fs.readFileSync('tmp.html').toString('utf-8'));
    console.log(`Searching m3u8...`);
    const contentDiv = $('.content');
    let result = contentDiv.next().html();
    const m3u8 = result.indexOf('m3u8');
    let pos = m3u8;
    while (result[pos]+result[pos-1]+result[pos-2]+result[pos-3]!=="ptth"){
        pos--;
    }
    console.log('Done!');
    const m3u8_url = result.slice(pos-3,m3u8+4);
    console.log(`m3u8 url is ${m3u8_url}`);
    console.log(`Calling ffmpeg...`);
    child_process.execSync(`ffmpeg -i ${m3u8_url} -c copy -bsf:a aac_adtstoasc "output.mp4"`);
    console.log(`Saved as output.mp4`);
}
main();
