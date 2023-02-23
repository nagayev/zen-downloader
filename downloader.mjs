import cheerio from 'cheerio';
import fetch from 'node-fetch'
import fs from 'fs';
import child_process from 'child_process';

async function main(){
    if (!(process.argv.length==3 || process.argv.length==4)){
        console.error(`Invalid script usage!`);
        console.log(`Usage: node downloader.mjs video_url [saveAs]`);
        console.log(`Default saveAs value is zen.mp4`);
        process.exit(1);
    }
    const url = process.argv[2];
    const saveAs = process.argv[3]?process.argv[3]:"zen.mp4";
    console.log(`url is ${url}`);
    console.log(`Loading html document...`);
    const response = await fetch(url,{method:'POST'});
    const body = await response.text();
    const $ = cheerio.load(body);
    console.log(`Searching mpd...`);
    const contentDiv = $('.content');
    let result = contentDiv.next().html();
    const mpd = result.indexOf('mpd');
    let pos = mpd;
    if (pos===-1){
        console.log(`Coudn't find mpd url`);
        process.exit(2);
    }
    while (result[pos]+result[pos-1]+result[pos-2]+result[pos-3]!=="ptth"){
        pos--;
    }
    console.log('Done!');
    const mpd_url = result.slice(pos-3,mpd+3);
    console.log(`mpd url is ${mpd_url}`);
    console.log(`Downloading using youtube-dl...`);
    child_process.execSync(`youtube-dl ${mpd_url} --output ${saveAs}`);
    console.log(`Saved as ${saveAs}`);
}
main();
