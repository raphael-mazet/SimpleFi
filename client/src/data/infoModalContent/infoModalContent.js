export default function infoModalContent(content) {
  let modalText;
  switch(content) {
    case 'about':
      modalText = 'SimpleFi is a tool to manage decentralised financial investments. It\'s free and open source. \nPlease send your feedback to feedback@simplefi.finance.';
      break;
    default:
      modalText = '';
  }
  return modalText;
}