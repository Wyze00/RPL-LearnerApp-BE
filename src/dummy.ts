import type { User } from "prisma/generated/client.js";
import { BcryptUtil } from "./utils/bcrypt.util.js";
import { prismaClient } from "./utils/prisma.util.js";

async function createDummy() {

    const user1: User = await prismaClient.user.create({
        data:   {
                    id: 'user1',
                    name: 'User 1',
                    username: 'User 1',
                    email: 'User1@gmail.com',
                    password: await BcryptUtil.hash('user1user1'),
                    learner: {
                        create: {
                            id: 'learner1',
                        }
                    },
                    instructor: {
                        create: {
                            id: 'instructor1',
                        }
                    },
                }
    })

    const user2: User = await prismaClient.user.create({
        data:   {
                    id: 'user2',
                    name: 'User 2',
                    username: 'User 2',
                    email: 'User2@gmail.com',
                    password: await BcryptUtil.hash('user2user2'),
                    learner: {
                        create: {
                            id: 'learner2',
                        }
                    },
                    instructor: {
                        create: {
                            id: 'instructor2',
                        }
                    },
                }
    })

    const admin1: User = await prismaClient.user.create({
        data:   {   
                    id: 'admin1',
                    name: 'Admin 1',
                    username: 'Admin 1',
                    email: 'Admin1@gmail.com',
                    password: await BcryptUtil.hash('admin1admin1'),
                    admin: {
                        create: {
                            id: 'admin1',
                        }
                    },
                    learner: {
                        create: {
                            id: 'learner3',
                        }
                    },
                    instructor: {
                        create: {
                            id: 'instructor3',
                        }
                    },
                }
    })

    await prismaClient.course.createMany({
        data: [
            {
                id: 'course1',
                title: 'Course 1',
                instructor_id: 'instructor1',
                description: 'Description 1',
                preview_video_link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                price: 10000,
            },
            {
                id: 'course2',
                title: 'Course 2',
                instructor_id: 'instructor1',
                description: 'Description 2',
                preview_video_link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                price: 20000,
            }
        ]
    })

    await prismaClient.course.createMany({
        data: [
            {
                id: 'course3',
                title: 'Course 3',
                instructor_id: 'instructor2',
                description: 'Description 3',
                preview_video_link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                price: 30000,
            },
            {
                id: 'course4',
                title: 'Course 4',
                instructor_id: 'instructor2',
                description: 'Description 4',
                preview_video_link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                price: 40000,
            }
        ]
    })

    await prismaClient.video.createMany({
        data: [
            {
                id: 'video1',
                course_id: 'course1',
                title: 'Video 1',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 1,
            },
            {
                id: 'video2',
                course_id: 'course1',
                title: 'Video 2',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 2,
            },
            {
                id: 'video3',
                course_id: 'course2',
                title: 'Video 1',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 1,
            },
            {
                id: 'video4',
                course_id: 'course2',
                title: 'Video 2',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 2,
            },
            {
                id: 'video5',
                course_id: 'course3',
                title: 'Video 1',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 1,
            },
            {
                id: 'video6',
                course_id: 'course3',
                title: 'Video 2',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 2,
            },
            {
                id: 'video7',
                course_id: 'course4',
                title: 'Video 1',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 1,
            },
            {
                id: 'video8',
                course_id: 'course4',
                title: 'Video 2',
                link: 'https://youtu.be/dQw4w9WgXcQ?si=vSkUlto5rXWshgcI',
                duration: 60,
                order: 2,
            }
        ]
    })
}


// createDummy();