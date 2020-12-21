export default function amendModal(message, loadingMessage) {
  let headline;
  let actions;
  switch (message) {

    case 'balances':
      headline = 'Loading balances';
      actions = [
        'Fetching token and field balances',
        'Fetching historic token transactions',
        'Fetching unclaimed rewards',
      ]
      break;

    case 'rewinding':
      headline = 'Rewinding invested balances';
      actions = [
        'Rewinding underlying farming investments',
        'Rewinding underlying tokens'

      ];
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
      actions = loadingMessage.actions.map(
        action => {
          if (action === message) {
            action = action + '  ✔️';
          }
          return action
        }
        );
    }
    return {headline, actions}
}