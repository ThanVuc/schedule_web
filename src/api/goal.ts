
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const GoalApiUrl = {
    getListGoals: createAPI('goals'),
    deleteGoal: createAPI('goals'),
    createGoal: createAPI('goals'),
    updateGoal: createAPI('goals'),
}
export default GoalApiUrl