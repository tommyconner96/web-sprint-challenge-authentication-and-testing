
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, username: 'test1', password: '$2a$12$j1RFEq243ZO1qmRBKSD6AOBEne5I6lJ12szbCB2hhDRnOrZoO0UOy' },
        { id: 2, username: 'test2', password: '$2a$12$j1RFEq243ZO1qmRBKSD6AOBEne5I6lJ12szbCB2hhDRnOrZoO0UOy' },
        { id: 3, username: 'test3', password: '$2a$12$j1RFEq243ZO1qmRBKSD6AOBEne5I6lJ12szbCB2hhDRnOrZoO0UOy' }
      ])
    })
}
