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
    playingIndex:'',
    havevoice:true,
    playStatus:true,
    backIndex:'',
    backMusic:'',
    ontime:false
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
    changePlay:function(){
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
      let url = id? 'getSong.php?id='+id: 'getSong.php?id=0'
      this.getJSON(url).then(function(data) {
        let yAudio = document.getElementById('player');
        vm.musicArray = data.tracks;
        vm.musicLength = vm.musicArray.length;
        let album_pic = document.getElementsByClassName('ym-album')[0]
        album_pic.style.backgroundImage = 'url('+data.cover+')';
        if (data.lrc != "no") {
          vm.showlrc = data.lrc;
        } else {
          vm.showlrc = [{lyric:'暂无歌词'}];
        }
        vm.song_name = data.music_name;
        vm.album_name = data.album_name;
        vm.artist_name = data.artists;
        vm.playingMusic = data.id;
        vm.playingIndex = data.index;
        yAudio.setAttribute("src", data.mp3);
        yAudio.volumn = 0.5;
        yAudio.play();
      }, function(error) {
        alert('服务器通信异常');
      });
    },
    changeVoice:function(event){
      let yAudio = document.getElementById('player');
      yAudio.volume = event.target.value / 10;
    },
    backMusic:function(){
      let yAudio = document.getElementById('player');
      let album_pic = document.getElementsByClassName('ym-album')[0]
      let random_index = Math.ceil(Math.random()*this.musicLength);
      let random_id = this.musicArray[random_index].id;
      this.showlrc = [];
      this.getJSON('getLyrics.php?id='+random_id).then(function(data) {
        if (data.lrc != "no") {
          vm.showlrc= data.lrc;
        } else {
          vm.showlrc= [{lyric:'暂无歌词'}];
        }
      }, function(error) {
        alert('服务器通信异常');
      });
      let artists_name = '';
      for(let i in this.musicArray[random_index].artists){
        artists_name += this.musicArray[random_index].artists[i].name 
      }
      album_pic.style.backgroundImage = 'url('+this.musicArray[random_index].album.picUrl+')';
      this.playingMusic = this.musicArray[random_index].id;
      this.song_name = this.musicArray[random_index].name;
      this.album_name = this.musicArray[random_index].album.name;
      this.artist_name = artists_name;
      let mp3_address = this.musicArray[random_index].mp3Url;
      yAudio.setAttribute("src", mp3_address);
      yAudio.volumn = 0.5;
      yAudio.play();
    },
    nextMusic:function(){
      let yAudio = document.getElementById('player');
      this.backMusic = this.playingMusic;
      this.backMusic = this.playingMusic;
      let album_pic = document.getElementsByClassName('ym-album')[0]
      let random_index = Math.ceil(Math.random()*this.musicLength);
      let random_id = this.musicArray[random_index].id;
      this.showlrc = [];
      this.getJSON('getLyrics.php?id='+random_id).then(function(data) {
        if (data.lrc != "no") {
          vm.showlrc= data.lrc;
        } else {
          vm.showlrc= [{lyric:'暂无歌词'}] ;
        }
      }, function(error) {
        alert('服务器通信异常');
      });
      let artists_name = '';
      for(let i in this.musicArray[random_index].artists){
        artists_name += this.musicArray[random_index].artists[i].name 
      }
      album_pic.style.backgroundImage = 'url('+this.musicArray[random_index].album.picUrl+')';
      this.playingMusic = this.musicArray[random_index].id;
      this.song_name = this.musicArray[random_index].name;
      this.album_name = this.musicArray[random_index].album.name;
      this.artist_name = artists_name;
      let mp3_address = this.musicArray[random_index].mp3Url;
      yAudio.setAttribute("src", mp3_address);
      yAudio.volumn = 0.5;
      yAudio.play();
    },
    display_lrc:function() {
      let yAudio = document.getElementById('player');
      play_time = Math.floor(yAudio.currentTime).toString();
      this.ontime =true;
    }
  }
})
  
  
