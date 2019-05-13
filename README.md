# Menoetius

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

# Mysql query

`SELECT COUNT(h.id) as hosts, h.account_id, a.name, a.email FROM hosts as h  LEFT JOIN accounts as a ON h.account_id = a.id GROUP BY account_id;`
