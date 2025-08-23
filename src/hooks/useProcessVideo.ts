import { useHttpsCallable } from 'react-firebase-hooks/functions';
import { fireFunctions } from '../firebase';

const firebaseFunctionName = 'videoGen';

export const useProcessVideo = () => {
    const [executeCallable, executing, error] = useHttpsCallable(
        fireFunctions,
        firebaseFunctionName
    );

    return {
        processVideo: () =>
            executeCallable({
                imagePrefix: 'frames/frame-',
                imageCount: 24,
                frameRate: 24,
                outputFilename: 'output-video.mp4',
            }),
        videoIsProcessing: executing,
        videoCreateError: error,
    };
};
