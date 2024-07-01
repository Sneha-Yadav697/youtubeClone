import React, { useState, useEffect } from 'react';
import './Playvideo.css'

import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY } from '../../Data';
import { value_converter } from '../../Data';
import moment from 'moment';
import { useParams } from 'react-router-dom';



const Playvideo = () => {

  const{videoId} = useParams();
  const [apidata, setApidata] = useState(null);
  const [channelData, setChannelData] = useState(null)
  const [commentData , setCommentData] = useState([])

  const fetchVideoData = async () => {
    //fetching videos data
    const VideoDetail_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
    await fetch(VideoDetail_url).then(res => res.json()).then(data => setApidata(data.items[0]))


  }

  const fetchOtherData = async () => {
    //fetching channel data
    const channelData_URL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apidata.snippet.channelId}&key=${API_KEY}`
    await fetch(channelData_URL).then(res =>res.json()).then(data=>setChannelData(data.items[0]))

    //fetchiing comment data
    const commentData_URL = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`
    await fetch(commentData_URL).then(res=>res.json()).then(data=>setCommentData(data.items))
    console.log(data.items)
  }

  useEffect(() => {
    fetchVideoData();

  }, [videoId]);

  useEffect(() => {
    fetchOtherData();

  }, [apidata]);

  return (
    <div className='play-video'>
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <h3>{apidata ? apidata.snippet.title : "title here"}</h3>
      <div className='play-video-info'>
        <p>{apidata ? value_converter(apidata.statistics.viewCount) : "16k"} viewa &bull; {apidata ? moment(apidata.snippet.publishedAt).fromNow() : ""}</p>
        <div>
          <span><img src={like} alt="" />{apidata ? value_converter(apidata.statistics.likeCount) : "125k"}</span>
          <span><img src={dislike} alt="" /></span>
          <span><img src={share} alt="" />share</span>
          <span><img src={save} alt="" />save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData? channelData.snippet.thumbnails.default.url:""} alt="" />
        <div>
          <p>{apidata ? apidata.snippet.channelTitle : "unlonwn"}</p>
          <span>{channelData?value_converter(channelData.statistics.subscriberCount) :"0"} subscriber</span>
        </div>
        <button>subscribe</button>
      </div>
      <div className='vid-description'>
        <p>{apidata ? apidata.snippet.description.slice(0, 250) : "description here"}</p>
        <p>subscribe to the channel</p>
        <hr />
        <h4>{apidata ? value_converter(apidata.statistics.commentCount) : "0"}</h4>
       

{commentData.map((items,index)=>{
  return (
    
    <div  className='comment' key={index}>
    <img src={items.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
    <div>
      <h3>{items.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
      <p>{items.snippet.topLevelComment.snippet.textDisplay}</p>
      <div className='comment-action'>
        <img src={like} alt="" /><span>{value_converter(items.snippet.topLevelComment.snippet.likeCount)}</span>
        <img src={dislike} alt="" /><span></span>
      </div>
    </div>
  </div>
  )
})}
        

      </div>

    </div>
  );
}

export default Playvideo;
