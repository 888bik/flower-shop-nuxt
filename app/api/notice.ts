import type { MyRequest } from "~/plugins/axios";
import type { NoticeListResponse } from "~/types/api/notice";

export default (api: MyRequest) => ({
  getNoticeList() {
    return api.get<NoticeListResponse>("admin/notice/1");
  },
});
