###后台项目
> 运行项目
 - 1、`npm i`
 - 2、`node app.js`  
> 热更新
 - `supervisor app.js`

> mysql
- 数据库名称：`cloud_music`
* 已有的表：
    > 用户列表 `cloud_music_user`
    
    > 我的推荐 `cloud_music_my_recommend`
    
    > 创建歌单 `cloud_music_song_sheet`
    
    > 轮播图 `cloud_music_slide_pic`
    
    > 轮播图类型 `cloud_music_slide_pic_type`
    
    > 推荐歌单 `cloud_music_recommend_song`
    
    > 新歌 `cloud_music_new_song`
    
    > 云村精选 `cloud_music_select`
    
    > 云村推荐 `cloud_music_recomend`
    
    > 听听 `cloud_music_listen_listen`
    
    > 听听类型 `cloud_music_listen_listen_type`
    
    > 曲库 `cloud_music_song_lib`
    
    >视频库 `cloud_music_video_lib`
    
    >配置路径 `cloud_music_config_path`
    
    >广场 `cloud_music_square`
    
    >访问路径信息 `cloud_music_visit_info`
    
### 注：
  - 需要在public目录下再创建`img`文件夹用于上传文件时的保存路径
  - 和public目录同级再创建一个`log`文件夹，用于保存日志