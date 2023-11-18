\*\*Run The App in Docker
Make sure that Docker is installed on your machine then run the following command:

```
$ docker build . -t breackout

$ docker run -it --rm -p 3333:80 breackout
```

In this case your application will run on port `3333`
