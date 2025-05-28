import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';

import { User } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeUpdate(event: UpdateEvent<User>) {
    if (event.updatedColumns.find((column) => column.propertyName === 'password')) {
      if (event.databaseEntity.passwordUpdatedAt === null) {
        /**
         * INFO: scenario where the user is setting the password for the first time
         * In this situation, passwordUpdated should be set to initially account created time because there is a check
         * where if the JWT issued at time is older than passwordUpdatedAt time, jwt will be considered
         */
        event.entity.passwordUpdatedAt = new Date(event.databaseEntity.createdAt);
      } else {
        event.entity.passwordUpdatedAt = new Date();
      }
    }
  }
}
