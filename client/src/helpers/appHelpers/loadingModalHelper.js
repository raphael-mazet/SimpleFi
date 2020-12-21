export default function amendModal(message, loadingMessage) {
  let headline;
  let actions;
  switch (message) {

    case 'balances':
      headline = 'Loading balances';
      actions = [
        'Fetching primary token and field balances',
        'Fetching historic token transactions',
        'Fetching unclaimed rewards',
      ]
      break;

    case 'rewinding':
      headline = 'Rewinding invested balances';
      actions = [];
      break;

    case 'ROIs':
    headline = 'Calculating APYs and ROIs';
    actions = [
      'Fetching token and field prices',
      'Calculating APYs',
      'Calculating ROIs'
    ]
    break;

    default: 
      headline = loadingMessage.headline;
      actions = loadingMessage.actions.filter(
        action => action !== message
        );
    }
    console.log(' ---> headline', headline);
    console.log(' --->actions',actions);
    return {headline, actions}
}