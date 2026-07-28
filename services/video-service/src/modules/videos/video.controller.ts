import { Request, Response } from "express"
import { VideoService } from "./video.service"
import { VideoValidators } from "@yukikaze/validator"

class VideoController {
    private readonly videoService: VideoService

    constructor() {
        this.videoService = new VideoService()
    }

    public async getVideos(request: Request<{}, {}, {}, VideoValidators.QueryVideoParams>, response: Response) {
        return await this.videoService.getVideos(request, response)
    }

    public async createVideo(request: Request<{}, {}, VideoValidators.CreateVideoInput>, response: Response) {
        return await this.videoService.createVideo(request, response)
    }

    public async updateVideo(request: Request<{ id: string }, {}, VideoValidators.UpdateVideoInput>, response: Response) {
        return await this.videoService.updateVideo(request, response)
    }

    public async findVideo(request: Request<{ id: string }>, response: Response) {
        return await this.videoService.findVideo(request, response)
    }

    public async deleteVideo(request: Request<{ id: string }, {}>, response: Response) {
        return await this.videoService.deleteVideo(request, response)
    }

    public async addVideoView(request: Request<{ id: string }, {}>, response: Response) {
        return await this.videoService.addVideoView(request, response)
    }

    public async streamVideo(request: Request<{ id: string }>, response: Response) {
        return await this.videoService.streamVideo(request, response)
    }
}

export default new VideoController()