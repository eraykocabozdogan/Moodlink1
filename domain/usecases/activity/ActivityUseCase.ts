import { Activity } from "../../entities/Activity";
import { ActivityParticipation } from "../../entities/ActivityParticipation";
import { IActivityRepository } from "../../repositories/IActivityRepository";

export class ActivityUseCase {
  constructor(private activityRepository: IActivityRepository) {}

  async createActivity(
    userId: string,
    name: string,
    description: string,
    eventTime: Date,
    location?: string,
    category?: string,
    targetMoodDescription?: string,
    imageFileId?: string
  ): Promise<Activity> {
    // İş mantığı kontrolleri
    if (!userId || !name || !description || !eventTime) {
      throw new Error(
        "Kullanıcı ID'si, etkinlik adı, açıklaması ve zamanı gereklidir"
      );
    }

    if (name.length > 100) {
      throw new Error("Etkinlik adı 100 karakterden fazla olamaz");
    }

    if (description.length > 1000) {
      throw new Error("Etkinlik açıklaması 1000 karakterden fazla olamaz");
    }

    if (eventTime < new Date()) {
      throw new Error("Etkinlik zamanı gelecekte olmalıdır");
    }

    // Activity entity'sini oluştur
    const activity: Activity = {
      id: "", // ID backend tarafından oluşturulacak
      name,
      description,
      eventTime,
      location,
      createdByUserId: userId,
      category,
      targetMoodDescription,
      createdAt: new Date(),
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.activityRepository.create(activity);
  }

  async updateActivity(
    activityId: string,
    name: string,
    description: string,
    eventTime: Date,
    location?: string,
    category?: string,
    targetMoodDescription?: string,
    imageFileId?: string
  ): Promise<Activity> {
    if (!activityId) {
      throw new Error("Etkinlik ID'si gereklidir");
    }

    // İş mantığı kontrolleri
    if (!name || !description || !eventTime) {
      throw new Error("Etkinlik adı, açıklaması ve zamanı gereklidir");
    }

    if (name.length > 100) {
      throw new Error("Etkinlik adı 100 karakterden fazla olamaz");
    }

    if (description.length > 1000) {
      throw new Error("Etkinlik açıklaması 1000 karakterden fazla olamaz");
    }

    // Önce mevcut etkinliği al
    const existingActivity = await this.activityRepository.getById(activityId);

    // Activity entity'sini güncelle
    const updatedActivity: Activity = {
      ...existingActivity,
      name,
      description,
      eventTime,
      location,
      category,
      targetMoodDescription,
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.activityRepository.update(updatedActivity);
  }

  async deleteActivity(activityId: string): Promise<boolean> {
    if (!activityId) {
      throw new Error("Etkinlik ID'si gereklidir");
    }

    return this.activityRepository.delete(activityId);
  }

  async getActivity(activityId: string): Promise<Activity> {
    if (!activityId) {
      throw new Error("Etkinlik ID'si gereklidir");
    }

    return this.activityRepository.getById(activityId);
  }

  async getAllActivities(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    return this.activityRepository.getList(page, pageSize);
  }

  async getUserActivities(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir");
    }

    return this.activityRepository.getUserActivities(userId, page, pageSize);
  }

  async getRecommendedActivities(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    return this.activityRepository.getRecommendedActivities(page, pageSize);
  }

  async participateInActivity(
    userId: string,
    activityId: string
  ): Promise<ActivityParticipation> {
    if (!userId || !activityId) {
      throw new Error("Kullanıcı ID'si ve Etkinlik ID'si gereklidir");
    }

    return this.activityRepository.participateInActivity(activityId, userId);
  }

  async leaveActivity(userId: string, activityId: string): Promise<boolean> {
    if (!userId || !activityId) {
      throw new Error("Kullanıcı ID'si ve Etkinlik ID'si gereklidir");
    }

    return this.activityRepository.leaveActivity(activityId, userId);
  }
}
