import TopicStore from "./topic-store";

export {
    TopicStore
}

export default {
    TopicStore
}

export const createStoreMap = () => {
    return {
        topicStore: new TopicStore()
    }
}