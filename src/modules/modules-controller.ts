import { pre_processing } from './pre-processing'
import { positive_interaction_rate } from './positive_interaction_rate'
import { InteractionQueueProps } from './types' 
import { calculeTagsWeight } from './tags_weight'
import calculate_similarities from './calculate_similarities'
import interaction_tags_algorithm from './interaction_tags_algorithm'
import negative_content_algorithm from './negative_content_algorithm'

type ModuleControllerProps = { 
    interaction_queue: InteractionQueueProps
}
export async function Modules_Controller({interaction_queue}:ModuleControllerProps) {
    const calculated_similarities = await calculate_similarities()
    const processed_interactions = await pre_processing(interaction_queue)
    const aditional_features = await positive_interaction_rate(processed_interactions)
    const tags_with_weights = await calculeTagsWeight(processed_interactions, aditional_features)
    const posts_from_tags = await interaction_tags_algorithm({
        tags_with_weights,
        users_similarity: calculated_similarities.users_similarity,
        interaction_queue
    })

    const negative_post = await negative_content_algorithm({
        users_similarity: calculated_similarities.users_similarity,
        interaction_queue
    }) 
    const posts_arr = [posts_from_tags, negative_post]
    return posts_arr
}