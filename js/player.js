/*
* yPlayer
* Author yangzj1992
*/
"use strict"
var vm = new Vue({
  el: '#ym-player',
  data:{
    song_name:'',
    album_name:'',
    artist_name:'',
    showlrc: [],
    musicArray:'',
    playingMusic:'',
    havevoice:true,
    playStatus:true
  },
  created: function () {
    this.loadMusic();
  },
  methods: {
    getJSON:function(url) {
      let promise = new Promise(function(resolve, reject){
        let client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();function handler() {if ( this.readyState !== 4 ) {return;}if (this.status === 200) {resolve(this.response);} else {reject(new Error(this.statusText));}};
      });
      return promise;
    },
    changeplay:function(){
      let yAudio = document.getElementById('player');
      if(this.playStatus == false){
        this.playStatus = true;
        yAudio.play();
      }else{
        this.playStatus = false;
        yAudio.pause();
      }
    },
    loadMusic:function(id){
      this.getJSON('getNeteasePlayer.php?_='+ (new Date()).getTime()).then(function(data) {
        let musicArray = data.tracks;
        let musicLength = musicArray.length;
        let yAudio = document.getElementById('player');
        let album_pic = document.getElementsByClassName('ym-album')[0]
        // let randomMusic = Math.ceil(Math.random()*musicLength)
        album_pic.style.backgroundImage = 'url('+data.cover+')';
        let lyrics;
        if (data.lrc != "no") {
            for(let i in data.lrc){
              vm.showlrc.push({lyric:data.lrc[i]})
            }
        } else {
            vm.showlrc.push({lyric:'暂无歌词'})
        }
        vm.song_name = data.music_name;
        vm.album_name = data.album_name;
        vm.artist_name = data.artists;
        yAudio.setAttribute("src", data.mp3);
        yAudio.volumn = 0.5;
        yAudio.play();
      }, function(error) {
        alert('服务器通信异常');
      });
    },
    changevoice:function(event){
      let yAudio = document.getElementById('player');
      yAudio.volume = vol / 10;
    }
  }
})
  
  
