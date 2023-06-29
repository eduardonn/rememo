/**
 * Generates a function that generates randomized values based on the weights provided
 * in the range of 0 - [weights length]
 * @param {number[]} weights
 * @returns {function}
 */
export default function generateWeightedRandomizer(weights: number[]) {
  const weightsSum = weights.reduce((previous, current) => previous + current, 0);

  return () => {
    let randomValue = Math.ceil(Math.random() * weightsSum);

    let i = 0;
    while (randomValue > 0) {
      randomValue -= weights[i++];
    }
    return i;
  }
}