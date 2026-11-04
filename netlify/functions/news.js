const news = [
  {
    category: 'Премьеры',
    title: 'Фантастика века: анонсированы съёмки продолжения',
    description: 'Студия подтвердила дату релиза и вернула режиссёра первой части.',
    image: 'https://picsum.photos/seed/kino1/80/80',
  },
  {
    category: 'Фестивали',
    title: 'Венецианский кинофестиваль назвал победителей',
    description: 'Главный приз увезла драма, снятая полностью на одной локации.',
    image: 'https://picsum.photos/seed/kino2/80/80',
  },
  {
    category: 'Кассовые сборы',
    title: 'Комедия установила рекорд проката',
    description: 'За первую неделю картина собрала рекордную сумму в прокате.',
    image: 'https://picsum.photos/seed/kino3/80/80',
  },
];

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(news),
});
