const Discord = require ("discord.js");
const {Client} = require ('discord.js');

const {
	token,
} = require('./config.json');

const client = new Client();
const ytdl = require("ytdl-core");
client.once('ready', () => {
  console.log('Ready!');
 });
 client.once('reconnecting', () => {
  console.log('Reconnecting!');
 });
 client.once('disconnect', () => {
  console.log('Disconnect!');
 });

const queue = new Map();





client.login(token);

////////////////////////////////////////////////////////
client.on("message",(message) => {
    if (message.content ==="Привет бухарь" || message.content ==="П ривет Бухарь"){
        message.reply("Пошёл нахуй!:wave:");
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
    checker  = queue.get(message.guild.id)
    if (queue != null){
      for (let i = 0; i < checker.songs.length; i++){
        for (var n in checker.songs){
          //var
            key = n,
            //type = typeof(checker.songs[this.n]),
            value = checker.songs.Array[0];

            //for (var l in n){
             // var
             //   key = l;
              //  value = Object.keys;
                channel.send('Трек: '+key+' '+value );
            }
            
          }
      } else {
    channel.send("Пусто!");
    //console.log(checker.songs);
    }
  }


  async function playlist(serverQueue, message){
    
    const playlist =[
      "https://www.youtube.com/watch?v=FMK5cZnW0os",
      "https://www.youtube.com/watch?v=o2eiUduoqWM"
    ]
    
    const songInfo = await ytdl.getInfo(playlist[0]);

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
    } 
  }


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
 




client.on('message', message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;
  
    if (message.content === 'Присоединяйся' || message.content === 'присоединяйся') {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member.voice.channel) {
        message.reply('Ну хуль, присоединился');
        const connection = message.member.voice.channel.join();

        
        dispatcher.on('finish', () => {
        console.log('Finished playing!');
        });
      dispatcher.destroy();
     // dispatcher2.destroy();  
      } else {
        message.reply('Ты первый');
      }
    }

});

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
      if (channel.members.size === 4) {
          txtchannel.send("ОБЩИЙ СБОР!");
          const attachment = new Discord.Attachment('./res/band.jpg');
          txtchannel.send(attachment);
      }        
    }        
});

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