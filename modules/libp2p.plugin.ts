import Libp2p from "libp2p";
import WebSockets from "libp2p-websockets";
import WebRTCStar from "libp2p-webrtc-star";
import Mplex from "libp2p-mplex";
import Bootstrap from "libp2p-bootstrap";
import { NOISE } from "@chainsafe/libp2p-noise";
import Logger from "~/utils/logger";
import localforage from "localforage";
import PeerId, { JSONPeerId } from "peer-id";

var libp2p: Libp2p;
var logger = new Logger("libp2p");

/**
 * Signaling works in two parts: First, we connect to the relay server and
 * tell them who we're looking for. Second, the relay server tells us when
 * that peer joins and we establish a relayed connection to them.
 */
export default async function initNetworkingModule(signalingServer: string) {
  // assert(!context.p2p, "libp2p is already initialized.");

  libp2p = await Libp2p.create({
    peerId: await loadPeerId(),
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      listen: [
        "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      ],
    },
    modules: {
      transport: [WebSockets, WebRTCStar],
      connEncryption: [NOISE],
      streamMuxer: [Mplex],
      peerDiscovery: [Bootstrap],
    },
    config: {
      peerDiscovery: {
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
        [Bootstrap.tag]: {
          enabled: true,
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
          ],
        },
      },
    },
  });

  return libp2p;
}

// Listen for new peers
// libp2p.on('peer:discovery', (peerId) => {
//   log(`Found peer ${peerId.toB58String()}`)
// })
/**
 * The peer ID is used as a unique identifier for the people you call. If it
 * changes between each session, it's really annoying for the user.
 *
 * We save the peer ID in browser storage to keep it consistent between
 * calls.
 */
export async function loadPeerId() {
  const persistedPeerId: null | JSONPeerId = await localforage.getItem(
    "peerId"
  );

  const peerId = persistedPeerId
    ? await PeerId.createFromJSON(persistedPeerId)
    : await PeerId.create();

  if (persistedPeerId) {
    logger.debug("Restored peer ID:", peerId.toB58String());
  } else {
    logger.debug("Created a new peer ID:", peerId.toB58String());
    await localforage.setItem("peerId", peerId.toJSON());
  }

  return peerId;
}

// const ModuleId = {
//   WebSockets: WebSockets.prototype[Symbol.toStringTag],
// };
