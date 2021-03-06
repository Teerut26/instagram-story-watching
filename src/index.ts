import HttpRequest from "./http_request";
import { Item } from "./interfaces/story";
import EventEmitter from "events";
import _ from "lodash";

export default class InstagramStoryWatching extends EventEmitter {
    private http_request = new HttpRequest();
    public last_story: Item | null = null;
    private first_run: boolean = false;
    private history_id: string[] = [];

    private url: string = "";
    private cookie: string = "";

    constructor(url: string, cookie: string) {
        super();
        this.cookie = cookie;
        this.url = url;
        this.getData();
    }

    async getData() {
        setInterval(async () => {
            let res = await this.http_request.getData(this.url, this.cookie);
            let last_data = _.last(res.data.reel?.items);
            if (res.data.reel !== null && this.last_story === null) {
                this.last_story = last_data as Item;
                if (this.first_run) {
                    this.emit("item", last_data);
                    this.history_id.push(last_data?.id as string);
                }
                this.first_run = true;
            } else if (res.data.reel !== null) {
                let result = last_data?.id === this.last_story?.id;
                if (!result) {
                    if (
                        !this.history_id.includes(
                            (last_data as Item).id as string
                        )
                    ) {
                        this.emit("item", last_data);
                        this.last_story = last_data as Item;
                        this.history_id.push(last_data?.id as string);
                    }
                }
                this.first_run = true;
            } else {
                this.first_run = true;
            }
        }, 5000);
    }
}
