/*
* yPlayer
* Author yangzj1992
*/
"use strict"
Vue.config.debug = true;
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
    prevIndex:'',
    prevMusic:'',
    followIndex:'',
    followMusic:'',
    curtime:'00:00',
    musictime:'00:00',
    playingtime:0
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
      if(this.playStatus == false){
        this.playStatus = true;
        this.$els.mplayer.play();
      }else{
        this.playStatus = false;
        this.$els.mplayer.pause();
      }
    },
    loadMusic:function(id){
      let url = id? 'getSong.php?id='+id: 'getSong.php?id=0'
      this.getJSON(url).then(function(data) {
        vm.musicArray = data.tracks;
        vm.musicLength = vm.musicArray.length;
        vm.$els.album.style.backgroundImage = 'url('+data.cover+')';
        if (data.lrc != "no") {
          vm.showlrc = data.lrc;
        } else {
          vm.showlrc = {"0":"暂无歌词"}
        }
        vm.song_name = data.music_name;
        vm.album_name = data.album_name;
        vm.artist_name = data.artists;
        vm.playingMusic = data.id;
        vm.playingIndex = data.index;
        vm.$els.mplayer.setAttribute("src", data.mp3);
        vm.$els.mplayer.volumn = 0.5;
        vm.$els.mplayer.play();
      }, function(error) {
        alert('服务器通信异常');
      });
    },
    changeVoice:function(event){
      this.$els.mplayer.volume = event.target.value / 10;
      if(event.target.value == 0){
        this.havevoice = false;
      }else{
        this.havevoice = true;
      }
    },
    nextMusic:function(){
      var random_index;
      var random_id;
      if(!this.followMusic || !this.followIndex){
        random_index = Math.ceil(Math.random()*this.musicLength);
        random_id = this.musicArray[random_index].id;
      }else{
        random_index = this.followIndex;
        random_id = this.followMusic;
      }
      this.followIndex = '';
      this.followMusic = '';
      this.prevMusic = this.playingMusic;
      this.prevIndex = this.playingIndex;
      this.showlrc = [];
      this.getJSON('getLyrics.php?id='+random_id).then(function(data) {
        if (data.lrc != "no") {
          vm.showlrc= data.lrc;
        } else {
          vm.showlrc= {"0":"暂无歌词"} ;
        }
      }, function(error) {
        alert('服务器通信异常');
      });
      let artists_name = '';
      for(let i in this.musicArray[random_index].artists){
        artists_name += this.musicArray[random_index].artists[i].name 
      }
      this.$els.album.style.backgroundImage = 'url('+this.musicArray[random_index].album.picUrl+')';
      this.playingMusic = this.musicArray[random_index].id;
      this.playingIndex = random_index;
      this.song_name = this.musicArray[random_index].name;
      this.album_name = this.musicArray[random_index].album.name;
      this.artist_name = artists_name;
      let mp3_address = this.musicArray[random_index].mp3Url;
      this.$els.mplayer.setAttribute("src", mp3_address);
      this.$els.mplayer.volumn = 0.5;
      this.$els.mplayer.play();
      this.playStatus = true;
    },
    backMusic:function(){
      if(!this.prevMusic || !this.prevIndex){
        return false;
      }
      this.followIndex = this.playingIndex;
      this.followMusic = this.playingMusic;
      this.showlrc = [];
      this.getJSON('getLyrics.php?id='+this.prevMusic).then(function(data) {
        if (data.lrc != "no") {
          vm.showlrc= data.lrc;
        } else {
          vm.showlrc= {"0":"暂无歌词"};
        }
      }, function(error) {
        alert('服务器通信异常');
      });
      let artists_name = '';
      for(let i in this.musicArray[this.prevIndex].artists){
        artists_name += this.musicArray[this.prevIndex].artists[i].name 
      }
      this.$els.album.style.backgroundImage = 'url('+this.musicArray[this.prevIndex].album.picUrl+')';
      this.playingMusic = this.musicArray[this.prevIndex].id;
      this.playingIndex = this.prevIndex;
      this.song_name = this.musicArray[this.prevIndex].name;
      this.album_name = this.musicArray[this.prevIndex].album.name;
      this.artist_name = artists_name;
      let mp3_address = this.musicArray[this.prevIndex].mp3Url;
      this.prevMusic = '';
      this.prevIndex = '';
      this.$els.mplayer.setAttribute("src", mp3_address);
      this.$els.mplayer.volumn = 0.5;
      this.$els.mplayer.play();
      this.playStatus = true;
    },
    getMusic:function(){
      let m_second,m_minute;
      let temp_minute = parseInt(this.$els.mplayer.duration / 60);
      if(temp_minute.toString().length > 1){
        m_minute = '' + temp_minute;
      }else{
        m_minute = '0' + temp_minute;
      }
      let temp_second = parseInt(this.$els.mplayer.duration % 60);
      if(temp_second.toString().length > 1){
        m_second = '' + temp_second;
      }else{
        m_second = '0' + temp_second;
      }
      this.musictime = m_minute + ':' + m_second;
    },
    playEvent:function(){
      let c_second,c_minute;
      let temp_minute = parseInt(this.$els.mplayer.currentTime / 60);
      if(temp_minute.toString().length > 1){
        c_minute = '' + temp_minute;
      }else{
        c_minute = '0' + temp_minute;
      }
      let temp_second = parseInt(this.$els.mplayer.currentTime % 60);
      if(temp_second.toString().length > 1){
        c_second = '' + temp_second;
      }else{
        c_second = '0' + temp_second;
      }
      this.curtime = c_minute + ':' + c_second;
      let play_time = Math.floor(this.$els.mplayer.currentTime).toString();
      this.display_lrc(play_time);
    },
    display_lrc:function(play_time) {
      // let keys = Object.keys(this.showlrc);
      // for(let i = 0;i<keys.length;i++){
      //   if(play_time < keys[i])
      // }
      this.playingtime = play_time;
    }
  }
})
  
  
