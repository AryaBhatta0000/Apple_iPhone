import React, { useEffect, useRef, useState } from 'react'
import { highlightsSlides } from '../constants'
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

const VideoCarousel = () => {

    const videoRef=useRef([]);
    const videoSpanRef=useRef([]);
    const videoDivRef=useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId:0,
        isLAstVideo:false,
        isPlaying: false,
    })

    const [loadedData, setLoadedData] = useState([]);

    const {isEnd, isLAstVideo, startPlay, videoId, isPlaying} =video;

    useGSAP(()=>{

    gsap.to('#slider',{
        transform: `translateX(${-100* videoId }%)`,
        duration: 2,
        ease:'power2.inOut'
    })
        gsap.to('#video',{
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none '
            },
            onComplete:()=>{
                setVideo((pre)=>({
                    ...pre,
                    startPlay:true,
                    isPlaying:true
                }))
            }
        })
    },[isEnd,videoId])

    useEffect(() => {      
            if(loadedData.length>3){
                if (!isPlaying){
                    videoRef.current[videoId].pause();
                }else{
                    startPlay && videoRef.current[videoId].play();
                }
            }
    }, [startPlay,videoId,isPlaying,loadedData]);

    const handleLoadedMetadata=(i,e) => setLoadedData
    ((pre)=> [...pre,e])

    useEffect(()=>{
        let currentProgress=0;
        const span =videoSpanRef.current;
        if (span[videoId]){
            const anim=gsap.to(span[videoId],{
                onUpdate:()=>{
                    const progress=Math.ceil(anim.progress()*100);
                    if (progress !== currentProgress) {
                        currentProgress=progress;
                        gsap.to(videoDivRef.current[videoId],{
                            width: window.innerWidth<760 ? '10vw' :window.innerWidth<1200
                            ?'10vw'
                            : '4vw'
                        })
                        gsap.to(span[videoId],{
                            width: `${currentProgress}%`,
                            backgroundColor:'white'
                        })
                    }
                },
                onComplete:()=>{
                    if (isPlaying){
                        gsap.to(videoDivRef.current[videoId],{
                            width: '12px'
                        })
                        gsap.to(span[videoId],{
                            backgroundColor: '#afafaf'
                        })
                    }
                }
            })

            if (videoId=== 0) {
                anim.restart();
            }
            const animUpdate=()=>{
                anim.progress(videoRef.current[videoId].currentTime /
                    highlightsSlides[videoId].videoDuration);
            };
            if (isPlaying){
                gsap.ticker.add(animUpdate)
            } else{
                gsap.ticker.remove(animUpdate)
            }
        }
       
    },[videoId, startPlay])

    const handleProcess=(type,i)=>{
        switch(type){
            case 'video-end':
                setVideo((pre)=> ({...pre,isEnd:
                    true, videoId: i+1
                }))
                break;
            case 'video-last':
                setVideo((pre) => ({...pre,isLAstVideo:
                    true}))
                    break;
            case 'video-reset':
                setVideo((pre)=> ({...pre,isLAstVideo:
                    false,
                    videoId:0
                }))
                break;
            case 'play':
                setVideo((pre)=> ({...pre,isPlaying:
                    !pre.isPlaying,
                   
                }))
                break;
            case 'pause':
                setVideo((pre)=> ({...pre,isPlaying:
                    !pre.isPlaying,
                   
                }))
                break;

                default:
                    return video;
        }
    }

  return (
    <>
    <div className='flex items-center'>
    {highlightsSlides.map((list,i)=>(
        <div key={list.id} id='slider' className='pr-10 sm:pr-20'>
            <div className='video-carousel_container'>
                <div className='flex-center size-full overflow-hidden rounded-3xl bg-black'>
                    <video 
                    id='video' 
                    playsInline={true} 
                    preload='auto'
                    muted
                    className={`${
                        list.id === 2 && 'translate-x-44'}
                        pointer-events-none
                    `}
                    ref={(el)=>(videoRef.current[i]=el)}
                    onEnded={()=>
                        i !== 3
                        ? handleProcess('video-end',i)
                        : handleProcess('video-last')
                    }
                    onPlay={()=>{
                        setVideo((prevVideo)=>({
                            ...prevVideo,isPlaying:true
                        }))
                    }}
                    onLoadedMetadata={(e)=> handleLoadedMetadata(i,e)}
                    >
                        <source src={list.video} type='video/mp4'/>
                    </video>
                </div>
                <div className='absolute left-[5%] top-12 z-10'>
                    {list.textLists.map((text)=>(
                        <p key={text} className='text-xl font-medium md:text-2xl'>
                            {text}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    ))}
    </div>

    <div className='flex-center relative mt-10'>
        <div className='flex-center rounded-full bg-gray-300 px-7 py-5 backdrop-blur'>
        {videoRef.current.map((_, i)=>(
                <span key={i} 
                ref={(el)=>(videoDivRef.current[i]=el)} 
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className='relative mx-2 size-3 cursor-pointer rounded-full bg-gray-200'> 
                <span className='absolute size-full rounded-full' 
                 ref={(el)=>(videoSpanRef.current[i]=el)} />
                </span>
            ))}
        </div>

        <button className='control-btn'>
            <img 
            src={isLAstVideo? replayImg : !isPlaying ? playImg : pauseImg}
             alt= {isLAstVideo ? 'replay' : !isPlaying? 'play' : 'pause'}
             onClick={isLAstVideo
                ?()=>handleProcess('video-reset')
                : !isPlaying
                ? () => handleProcess('play')
                : ()=> handleProcess('pause')
             }
            />
        </button>
    </div>
    </>
  )
}

export default VideoCarousel