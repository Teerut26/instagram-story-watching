```.ts
let instagramStoryWatching = new InstagramStoryWatching(
    "https://i.instagram.com/api/v1/feed/user/xxxxxxxx/story/","cookie"
);

instagramStoryWatching.events.on("item", (data: Item) => {
    console.log(data);
});

```
