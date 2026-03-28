import { convexClient } from '@/lib/convexClient';
import { api } from 'convex/_generated/api';
import { Project, CreateProjectInput, UpdateProjectInput } from '../types';

function mapProject(doc: any): Project {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  };
}

export const projectService = {
  async getAll(_page = 1, _limit = 10) {
    const data = await convexClient.query(api.projects.list);
    const mapped = (data || []).map(mapProject);
    return { data: mapped, count: mapped.length };
  },

  async getById(id: string) {
    const data = await convexClient.query(api.projects.getById, { id: id as any });
    if (!data) throw new Error('Project not found');
    return mapProject(data);
  },

  async create(project: CreateProjectInput) {
    const id = await convexClient.mutation(api.projects.create, {
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      live_url: project.live_url,
      github_url: project.github_url,
      technologies: project.technologies,
      featured: project.featured,
      order_index: project.order_index,
    });
    return { id, ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Project;
  },

  async update({ id, ...updates }: UpdateProjectInput) {
    await convexClient.mutation(api.projects.update, { id: id as any, ...updates });
    return await this.getById(id);
  },

  async delete(id: string) {
    await convexClient.mutation(api.projects.remove, { id: id as any });
  },
};

