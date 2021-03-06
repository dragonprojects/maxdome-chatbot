import { AssetsQuery } from 'mxd-heimdall';

export default ({ heimdall }) => async ({ args, reply, translate }) => {
  if (!args) {
    return;
  }
  const query = new AssetsQuery()
    .filter('contentTypeSeriesOrMovies')
    .filter('search', args)
    .query('pageSize', process.env.MXD_SEARCH_PAGESIZE || 3);
  const assets = await heimdall.getAssets(query);
  if (assets.length) {
    const hostname = process.env.MXD_SEARCH_HOSTNAME || 'store.maxdome.de';
    const attachments = assets.map(asset => ({
      title: asset.title,
      text: asset.description,
      image: asset.image,
      link: `https://${hostname}/${asset.id}`,
    }));
    attachments.push({
      title: translate.text('Show all results...'),
      link: `https://${hostname}/suche?search=${encodeURIComponent(args)}`,
    });
    reply.send(
      translate.text("Results found for '%s'", args),
      attachments
    );
  } else {
    reply.send(translate.text("No results found for '%s'", args));
  }
};
