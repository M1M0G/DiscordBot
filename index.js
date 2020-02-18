const Discord = require ("discord.js");
const {Client, RichEmbed} = require ('discord.js');
const	{token} = require("./config.json");
// const request = require('request'); 
// const cheerio = require('cheerio');
// const iconv = require('iconv-lite');
const client = new Client();
const ytdl = require("ytdl-core");
const queue = new Map();
//client.channels.get('678678834442272808');

////////////////////////////////////////////////////////
client.on("message",(message) => {
    if (message.content ==="Привет бухарь" || message.content ==="П ривет Бухарь"){
        message.reply("Пошёл нахуй!:wave:");
        message.channel.send(':poop:');
    }
});
client.on("message",(message) => {
    if (message.content ==="бухарь?" || message.content ==="Бухарь?"){ 
        message.reply("Чё надо? :face_with_raised_eyebrow:");
    }
});

client.on("message",(message) => {
  if (message.content ==="я считаю это победа" || message.content ==="я считаю это победа"){
      message.reply("Согласен, БД хуета!");
  }
});


client.on("message",(message) => {
    if (message.content === "Пошёл нахуй" || message.content ==="пошёл нахуй" ){
        message.delete(1500)
        .then(message.reply("Сам Пошёл НА ХУЙ!"))
        .catch(console.error);
    }
});

/////////////////////////////////////////////////
client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const serverQueue = queue.get(message.guild.id);
  if (message.content.startsWith(`!сбацай`)) {
  execute(message, serverQueue);
  return;
  } else if (message.content.startsWith(`!следующую`)) {
  skip(message, serverQueue);
  return;
  } else if (message.content.startsWith(`!стоп`)) {
  stop(message, serverQueue);
  return;
  } else if(message.content.startsWith("!лист")) { 
  list(message, queue);
  //message.channel.send('Нормально говори')
  } else if(message.content.startsWith("!плейлист")) { 
  playlist(message, queue);
    //message.channel.send('Нормально говори')
  }

});  

  function list(message, queue){
    const channel = client.channels.get("669150559680593954")
    channel.send("Проверяю...")
    //checker  = queue.get(message.guild.id)
   // if (queue != null){
   ///   for (let i = 0; i < checker.songs.length; i++){
    //    for (var n in checker.songs){
          //var
           // key = n,
            //type = typeof(checker.songs[this.n]),
            //value = checker.songs.Array[0];

            //for (var l in n){
             // var
             //   key = l;
       //       //  value = Object.keys;
      //          channel.send('Трек: '+key+' '+value );
       //     }
            
   //       }
   //   } else {
  //  channel.send("Пусто!");
  //  //console.log(checker.songs);
    }
  //}


  // async function playlist(serverQueue, message){
    
  //   const playlist =[
  //     "https://www.youtube.com/watch?v=FMK5cZnW0os",
  //     "https://www.youtube.com/watch?v=o2eiUduoqWM"
  //   ]
    
  //   const songInfo = await ytdl.getInfo(playlist[0]);

  //   const song = {
  //     title: songInfo.title,
  //     url: songInfo.video_url,
  //   };
    
  //   if (!serverQueue) {
  //   const queueContruct = {
  //     textChannel: message.channel,
  //     voiceChannel: voiceChannel,
  //     connection: null,
  //     songs: [],
  //     volume: 5,
  //     playing: true,
  //     };    

  //     queue.set(message.guild.id, queueContruct);
      
  //     queueContruct.songs.push(song);

  //     try {
  //       var connection = await voiceChannel.join();
  //       queueContruct.connection = connection;
  //       play(message.guild, queueContruct.songs[0]);
  //       } catch (err) {
  //       console.log(err);
  //       queue.delete(message.guild.id);
  //       return message.channel.send(err);
  //       }
  //   } 
  // }


  async function execute(message, serverQueue){
    const args = message.content.split(' ');
  
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('Залетай сначала');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('А где разрешение?');
    }
    
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
    title: songInfo.title,
    url: songInfo.video_url,
    };
  
    if (!serverQueue) {
    const queueContruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
    };
  
    queue.set(message.guild.id, queueContruct);
  
    queueContruct.songs.push(song);
  
    try {
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    play(message.guild, queueContruct.songs[0]);
    } catch (err) {
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
    }
    } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`Ща сбацаю`);
    }
  
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('Сначала зайди, чтобы следуйщую бахнуть');
    if (!serverQueue) return message.channel.send('Молчу же');
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('Сначала зайди, чтобы заткнуть меня');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
  
    if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
    }
  
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', () => {
    console.log('Всё, сбацал');
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
    console.error(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  }
 




// client.on('message', message => {
//     // Voice only works in guilds, if the message does not come from a guild,
//     // we ignore it
//     if (!message.guild) return;
  
//     if (message.content === 'Присоединяйся' || message.content === 'присоединяйся') {
//       // Only try to join the sender's voice channel if they are in one themselves
//       if (message.member.voice.channel) {
//         message.reply('Ну хуль, присоединился');
//         const connection = message.member.voice.channel.join();

        
//         dispatcher.on('finish', () => {
//         console.log('финиш!');
//         });
//       dispatcher.destroy();
//      // dispatcher2.destroy();  
//       } else {
//         message.reply('Ты первый');
//       }
//     }

// });

//client.on('message', message => { 
//    const dispatcher = connection.playFile('C:/DiscordBot/res/Chiki.mp3');
//if (message.content === 'Поехали' || message.content ==='поехали' ) {
//    dispatcher;
//    }/
//}

client.on("voiceStateUpdate", (old_member, new_member) => {
    // channel_name - название канала, к которому должен присоединяться бот в случае,
    
    let channel = client.channels.get("659425745256579086");
    let txtchannel = client.channels.get("659425745256579085")//client.channels.find(val => val.name == 'Основной');
    // check будет содержать в себе null, если new_member подключился не к нужному каналу.
    let check = channel.members.find(val => val.user.username == new_member.user.username);
    if (check != null ) {
      if (channel.members.size === 2) {
          txtchannel.send("ОБЩИЙ СБОР!");
          const attachment = new Discord.Attachment('./res/band.jpg');
          txtchannel.send(attachment);
      }        
    }        
});

// client.on('message', msg =>{
//  if(msg.startsWith("!позови")){
   
//  }
// })


///////////////////////////

///////////////////////////
//let checker = require('./rss.js')

//checker.Embedio(1);

const request = require('request'); 
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const url = "https://danger-zone-tactical.ru/rss/rss.xml";
let previosID = 30003;
let i = 0;


let check = setInterval(() => {
  request({
    uri: url, 
    method:'GET', 
    encoding:'binary'
}, function(err, res, page){
    let $=cheerio.load(iconv.encode (iconv.decode(new Buffer.from(page, 'binary'), 'utf8'), 'utf8'), {xmlMode: true });
    let id = $('articleID');
    let item = $('item');
    let getID = 0;
    let lastID = Number(id.get(0).firstChild.data);
    if(previosID !== lastID){
      getID = lastID - previosID;
      previosID = lastID;
      for(i=getID-1; i >= 0; --i){
        Embedio(item,i);
        console.log(id.get(i).firstChild.data);
      }
    }
})  
}, 10000);

function Embedio(item, i){
  let rss = {
      id: item.get(i).children[1].firstChild.data,
      head: item.get(i).children[3].firstChild.data,
      //img: item.get(i).children[5].childNodes[1].attr(url),
      content: item.get(i).children[7].firstChild.data,
      link: item.get(i).children[9].firstChild.data,
      author: item.get(i).children[11].firstChild.data
  };

  let replacer = rss.content.replace(new RegExp("&mdash;",'g'), "").replace(new RegExp("&raquo;",'g'), '-');
     rss.content = replacer;


  if(rss.content.length < 2048){
  } else {
      let str = rss.content;
      rss.content = [];
    for(let strl = 0; strl < 2044; strl++ ){
      rss.content +=str[strl];  
    }
    rss.content + "..."; 
    str = []; 
    }

  try{
    let embed = new RichEmbed(rss)
    .setTitle(rss.head)
    .setDescription(rss.content)
    .setAuthor(rss.author)
    //.setImage(rss.img)
    .attachFiles(['./res/au.jpg'])
    .setColor('#FF6347')
    .setFooter(rss.link);   
    let rss2 = client.channels.get('678678834442272808');
    rss2.send(embed);
    //rsschanel.send(embed);
  }
  catch(e){console.log("[Ошибка, блять]",e); console.log(rss)};

  }


check;





client.once('ready', () => {
  console.log('Ready!');
 });
 client.once('reconnecting', () => {
  console.log('Reconnecting!');
 });
 client.once('disconnect', () => {
  console.log('Disconnect!');
 });


client.login(token).catch(err => console.log(err)) || client.login(process.env.token).catch(err => console.log(err));





// const parser = new jsdom.JSDOM(``, { 
//   url: "https://danger-zone-tactical.ru/rss/rss.xml",
//   contentType: "text/xml"
// });
// let txtchannel = client.channels.get("659425745256579085")
// const dom =  new jsdom.JSDOM( {
//   url:`https://danger-zone-tactical.ru/rss/rss.xml`,
//   referrer:`https://danger-zone-tactical.ru/rss/rss.xml`
// });
// console.log(dom.window.document.querySelectorAll.toString);  //  "Hello world"
//txtchannel.send(dom.window.document.querySelectorAll.textContent);
// client.on( 'message', () =>{
//   parser. fromURL( "https://danger-zone-tactical.ru/rss/rss.xml",  options) .then( dom => {
//     console.log(dom.serialize());
//   });
// });


//client.on("message", message => {
//  const attachment = new Discord.Attachment('./res/band.jpg');
//  message.channel.send(message.author, attachment)
//  .catch((error) => {
//    console.log(error);
//  });
//})



//var Channel = client.channels.get("659425745256579086")

//Channel.send.content('Покакаю')
 /// ./then(message => console.log(`Sent message: ${message.content}`))
 //.catch(console.error);

//  ////
//  let id = "671805219176448010";
// /**
//  * @param {*} id ID канала, который нужно проверять 
//  */
// async function check(id){
//   if (Discord.channel.id.last_message_id !== null){
//     req;
//   } else {
//     console.log('fakGG');
//   }

// }


// let Rss = new Promise(id,err)
// .then(check(id), () => {
//   console.log(error= new Error);
// }

// // );

// let Rss = new Promise((good, bad) => {
//   //if (client.channels.get() === id && client.channels.last_message_id !== null){
//     req;
//   //} else {
//   //  console.log('fakGG');
//   //}
// })


// .then(
//   result => {
//     // первая функция-обработчик - запустится при вызове resolve
//     console.log("Fulfilled: " + result); // result - аргумент resolve
//   },
//   error => {
//     // вторая функция - запустится при вызове reject
//     console.log("Rejected: " + error); // error - аргумент reject
//   }
// );








// client.once('message', (msg) =>{
//   if (msg.content.startsWith("!news")){
//const axios = require('axios');

//postMessage("привет");
// console.log(title.get(0).firstChild.data);
// console.log(title.get(1).firstChild.data);
// console.log(title.get(2).firstChild.data);
// console.log(title.get(3).firstChild.data);
//img_src= $("channel:title");
//console.log(img_src);//.text());
//}});





//RssCall;

// axios.get(url)
//   .then(response =>{
//     //console.log(response.data);
//     Idata = response.data;
//   })
//   .catch(error => {
//     console.log(error);
//   })

// let getData = xml => {
//   let data = Idata;
//   const $ = cheerio.load("https://danger-zone-tactical.ru/rss/rss.xml",{xmlMode: true});
//   $('channel.item').each((i,elem)=>{   
//     data.push({
//       i: $(this.elem).text,
//       //item: $(elem)
//       //link: 4(elem).find('a.storylink').attr('href')
//     });
//   });
//   console.log(data);
// }
// getData(Idata);



