import { Request, Response } from "express";
import { get, controller, bodyValidator, post } from "./decorators";

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller("/auth")
class LoginController {
  @get("/login")
  getLogin(req: Request, res: Response): void {
    res.send(`
          <form method="POST">
              <div>
                  <label>Email</label>
                  <input name="email" />
              </div>
              <div>
                  <label>Password</label>
                  <input name="password" type="password" />
              </div>
              <button>Submit</button>
          </form>
        `);
  }

  @post("/login")
  @bodyValidator("email", "password")
  postLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    if (email === "hi@hi.com" && password === "pass") {
      req.session = { loggedIn: true };
      res.redirect("/");
    } else {
      res.status(422).send("Invalid email or password");
    }
  }

  @get("/logout")
  getLogout(req: Request, res: Response) {
    req.session = undefined;
    res.redirect("/");
  }
}
