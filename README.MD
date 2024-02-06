#### Setup // done

```bash
npm install && npm start
```

#### Database Connection  // done

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers//done

- auth.js // done
- jobs.js//done

#### User Model // done

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User//done

- Validate - name, email, password - with Mongoose//done
- Hash Password (with bcryptjs) // done
- Save User //done
- Generate Token//done
- Send Response with Token//done

#### Login User // done

- Validate - email, password - in controller done
- If email or password is missing, throw BadRequestError done
- Find User done
- Compare Passwords done
- If no user or password does not match, throw UnauthenticatedError done
- If correct, generate Token done
- Send Response with Token done

#### Mongoose Errors

- Validation Errors && duplicate i think those two will match khlui:)//done
- Duplicate (Email)//done
- Cast Error

#### Security

- helmet
- cors
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
