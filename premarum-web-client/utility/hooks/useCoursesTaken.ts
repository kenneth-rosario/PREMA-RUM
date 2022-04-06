import useSWR from "swr";
import {getCoursesTaken} from "../requests/getCoursesTaken";
import {ICoursesTakenResponse} from "../requests/responseTypes";
import addCoursesTaken from "../requests/addCoursesTaken";
import {pca} from "../constants";

export function useCoursesTaken() {
    const { data, error, mutate } = useSWR('CoursesTaken', async () => {
        return (await getCoursesTaken(pca)).data
    })
    
    async function addCoursesTakenToCache(courseIds: number[]) {
        await mutate(async (cachedData:any) => {
            return await addCoursesTaken(pca, courseIds)
        })
    }
    
    return {
        coursesTaken: data as ICoursesTakenResponse[] | undefined,
        isLoading: !error && !data,
        addCoursesTakenToCache,
        isError: error
    }
}